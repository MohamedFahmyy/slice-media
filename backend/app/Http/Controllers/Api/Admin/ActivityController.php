<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $logs = AuditLog::with('user:id,name,email,avatar')
            ->latest()
            ->paginate($request->query('per_page', 25));

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }
}
