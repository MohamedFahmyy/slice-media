<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::with(['role.permissions', 'roles.permissions'])
            ->where('email', $validated['email'])
            ->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Your staff account is currently suspended or inactive. Please contact the Super Administrator.',
            ], 403);
        }

        $user->update(['last_login_at' => now()]);

        // Revoke previous tokens if any, or generate fresh token
        $token = $user->createToken('admin-api-token')->plainTextToken;

        // Log audit event
        AuditLog::log('admin_login', $user, null, ['ip' => $request->ip()]);

        // Aggregate unique permissions
        $permissions = collect();
        if ($user->role) {
            $permissions = $permissions->concat($user->role->permissions->pluck('slug'));
        }
        foreach ($user->roles as $role) {
            $permissions = $permissions->concat($role->permissions->pluck('slug'));
        }
        $uniquePermissions = $permissions->unique()->values();

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'phone' => $user->phone,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                    'slug' => $user->role->slug,
                ] : null,
                'permissions' => $uniquePermissions,
                'last_login_at' => $user->last_login_at,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['role.permissions', 'roles.permissions']);

        $permissions = collect();
        if ($user->role) {
            $permissions = $permissions->concat($user->role->permissions->pluck('slug'));
        }
        foreach ($user->roles as $role) {
            $permissions = $permissions->concat($role->permissions->pluck('slug'));
        }
        $uniquePermissions = $permissions->unique()->values();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'phone' => $user->phone,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                    'slug' => $user->role->slug,
                ] : null,
                'permissions' => $uniquePermissions,
                'last_login_at' => $user->last_login_at,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'avatar' => ['nullable', 'string', 'max:500'],
            'current_password' => ['nullable', 'string', 'required_with:new_password'],
            'new_password' => ['nullable', 'string', 'min:8'],
        ]);

        if (!empty($validated['new_password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['Current password does not match.'],
                ]);
            }
            $user->password = Hash::make($validated['new_password']);
        }

        $user->name = $validated['name'];
        $user->phone = $validated['phone'] ?? $user->phone;
        $user->avatar = $validated['avatar'] ?? $user->avatar;
        $user->save();

        AuditLog::log('profile_updated', $user);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => $user,
        ]);
    }
}
