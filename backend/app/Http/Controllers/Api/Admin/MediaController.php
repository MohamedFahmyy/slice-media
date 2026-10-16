<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\MediaAsset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MediaAsset::query()->with('uploadedBy:id,name');

        if ($request->filled('type')) {
            $type = $request->query('type');
            if ($type === 'image') {
                $query->where('mime_type', 'like', 'image/%');
            } elseif ($type === 'video') {
                $query->where('mime_type', 'like', 'video/%');
            }
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('original_name', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%")
                  ->orWhere('alt_en', 'like', "%{$search}%")
                  ->orWhere('alt_ar', 'like', "%{$search}%");
            });
        }

        $assets = $query->latest()->paginate($request->query('per_page', 24));

        return response()->json([
            'success' => true,
            'data' => $assets,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'file' => ['required', 'file', 'max:51200', 'mimes:jpeg,png,jpg,webp,svg,mp4,mov,webm,pdf'],
            'title' => ['nullable', 'string', 'max:255'],
            'alt_en' => ['nullable', 'string', 'max:255'],
            'alt_ar' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $mimeType = $file->getClientMimeType();
        $fileSize = $file->getSize();

        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('uploads/' . date('Y/m'), $filename, 'public');

        $width = null;
        $height = null;
        if (str_starts_with($mimeType, 'image/') && $file->getClientOriginalExtension() !== 'svg') {
            $imageSize = @getimagesize($file->getRealPath());
            if ($imageSize) {
                $width = $imageSize[0];
                $height = $imageSize[1];
            }
        }

        $asset = MediaAsset::create([
            'filename' => $filename,
            'disk' => 'public',
            'path' => $path,
            'original_name' => $originalName,
            'mime_type' => $mimeType,
            'file_size' => $fileSize,
            'width' => $width,
            'height' => $height,
            'title' => $request->input('title', pathinfo($originalName, PATHINFO_FILENAME)),
            'alt_en' => $request->input('alt_en'),
            'alt_ar' => $request->input('alt_ar'),
            'tags' => $request->input('tags', []),
            'uploaded_by' => $user->id,
        ]);

        AuditLog::log('media_uploaded', $asset);

        return response()->json([
            'success' => true,
            'message' => 'Media asset uploaded successfully.',
            'data' => $asset,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $asset = MediaAsset::findOrFail($id);

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'alt_en' => ['nullable', 'string', 'max:255'],
            'alt_ar' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
        ]);

        $asset->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Media metadata updated.',
            'data' => $asset,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $asset = MediaAsset::findOrFail($id);

        // Delete from storage disk
        if (Storage::disk($asset->disk)->exists($asset->path)) {
            Storage::disk($asset->disk)->delete($asset->path);
        }

        $asset->delete();

        AuditLog::log('media_deleted', null, ['id' => $id, 'filename' => $asset->filename]);

        return response()->json([
            'success' => true,
            'message' => 'Media asset deleted successfully.',
        ]);
    }
}
