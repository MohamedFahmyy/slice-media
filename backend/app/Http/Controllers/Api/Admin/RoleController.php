<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        $roles = Role::with('permissions')->withCount('users')->get();
        $allPermissions = Permission::all()->groupBy('group');

        return response()->json([
            'success' => true,
            'data' => [
                'roles' => $roles,
                'available_permissions' => $allPermissions,
            ],
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $role = Role::findOrFail($id);

        if ($role->slug === 'super-admin') {
            return response()->json([
                'success' => false,
                'message' => 'Super Administrator permissions cannot be altered.',
            ], 422);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['exists:permissions,id'],
        ]);

        $role->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? $role->description,
        ]);

        $role->permissions()->sync($validated['permission_ids']);

        AuditLog::log('role_updated', $role);

        return response()->json([
            'success' => true,
            'message' => 'Role and permission matrices updated.',
            'data' => $role->load('permissions'),
        ]);
    }
}
