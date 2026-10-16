<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $videos = Video::with('translations')
            ->where('is_published', true)
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $videos,
        ]);
    }
}
