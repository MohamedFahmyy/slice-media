<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Video;
use App\Models\VideoTranslation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VideoController extends Controller
{
    public function index(): JsonResponse
    {
        $videos = Video::with('translations')->orderBy('order')->get();

        return response()->json([
            'success' => true,
            'data' => $videos,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'provider' => ['required', 'string', 'in:vimeo,youtube,self_hosted'],
            'provider_id' => ['required', 'string', 'max:100'],
            'format_type' => ['required', 'string', 'max:50'],
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'tagline_en' => ['nullable', 'string', 'max:255'],
            'tagline_ar' => ['nullable', 'string', 'max:255'],
            'badge_en' => ['nullable', 'string', 'max:100'],
            'badge_ar' => ['nullable', 'string', 'max:100'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'aspect_ratio' => ['nullable', 'string', 'max:20'],
            'order' => ['nullable', 'integer'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
        ]);

        return DB::transaction(function () use ($validated) {
            $video = Video::create([
                'provider' => $validated['provider'],
                'provider_id' => $validated['provider_id'],
                'format_type' => $validated['format_type'],
                'aspect_ratio' => $validated['aspect_ratio'] ?? '9:16',
                'order' => $validated['order'] ?? (Video::max('order') + 1),
                'is_featured' => $validated['is_featured'] ?? true,
                'is_published' => $validated['is_published'] ?? true,
            ]);

            VideoTranslation::create([
                'video_id' => $video->id,
                'locale' => 'en',
                'title' => $validated['title_en'],
                'tagline' => $validated['tagline_en'] ?? null,
                'badge' => $validated['badge_en'] ?? null,
                'description' => $validated['description_en'] ?? null,
            ]);

            VideoTranslation::create([
                'video_id' => $video->id,
                'locale' => 'ar',
                'title' => $validated['title_ar'],
                'tagline' => $validated['tagline_ar'] ?? null,
                'badge' => $validated['badge_ar'] ?? null,
                'description' => $validated['description_ar'] ?? null,
            ]);

            AuditLog::log('video_created', $video);

            return response()->json([
                'success' => true,
                'message' => 'Video showcase format created successfully.',
                'data' => $video->load('translations'),
            ], 201);
        });
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $video = Video::findOrFail($id);

        $validated = $request->validate([
            'provider' => ['required', 'string', 'in:vimeo,youtube,self_hosted'],
            'provider_id' => ['required', 'string', 'max:100'],
            'format_type' => ['required', 'string', 'max:50'],
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'tagline_en' => ['nullable', 'string', 'max:255'],
            'tagline_ar' => ['nullable', 'string', 'max:255'],
            'badge_en' => ['nullable', 'string', 'max:100'],
            'badge_ar' => ['nullable', 'string', 'max:100'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'aspect_ratio' => ['nullable', 'string', 'max:20'],
            'order' => ['nullable', 'integer'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
        ]);

        DB::transaction(function () use ($video, $validated) {
            $video->update([
                'provider' => $validated['provider'],
                'provider_id' => $validated['provider_id'],
                'format_type' => $validated['format_type'],
                'aspect_ratio' => $validated['aspect_ratio'] ?? $video->aspect_ratio,
                'order' => $validated['order'] ?? $video->order,
                'is_featured' => $validated['is_featured'] ?? $video->is_featured,
                'is_published' => $validated['is_published'] ?? $video->is_published,
            ]);

            VideoTranslation::updateOrCreate([
                'video_id' => $video->id,
                'locale' => 'en',
            ], [
                'title' => $validated['title_en'],
                'tagline' => $validated['tagline_en'] ?? null,
                'badge' => $validated['badge_en'] ?? null,
                'description' => $validated['description_en'] ?? null,
            ]);

            VideoTranslation::updateOrCreate([
                'video_id' => $video->id,
                'locale' => 'ar',
            ], [
                'title' => $validated['title_ar'],
                'tagline' => $validated['tagline_ar'] ?? null,
                'badge' => $validated['badge_ar'] ?? null,
                'description' => $validated['description_ar'] ?? null,
            ]);
        });

        AuditLog::log('video_updated', $video);

        return response()->json([
            'success' => true,
            'message' => 'Video showcase format updated successfully.',
            'data' => $video->fresh('translations'),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $video = Video::findOrFail($id);
        $video->delete();

        AuditLog::log('video_deleted', null, ['id' => $id, 'format_type' => $video->format_type]);

        return response()->json([
            'success' => true,
            'message' => 'Video deleted successfully.',
        ]);
    }
}
