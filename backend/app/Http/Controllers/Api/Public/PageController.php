<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function show(Request $request, string $slug): JsonResponse
    {
        $locale = $request->query('locale', 'en');
        $previewToken = $request->query('preview_token');

        $query = Page::with(['translations', 'sections' => function ($q) {
            $q->where('is_enabled', true)->orderBy('order');
        }])->where('slug', $slug);

        // If not in authenticated preview mode, require is_published = true
        if (!$previewToken && !auth('sanctum')->check()) {
            $query->where('is_published', true);
        }

        $page = $query->first();

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found or is currently unpublished.',
            ], 404);
        }

        // Format sections with convenient locale-friendly shortcuts
        $sections = $page->sections->map(function ($section) use ($locale) {
            return [
                'id' => $section->id,
                'type' => $section->section_type,
                'order' => $section->order,
                'layout_variant' => $section->layout_variant,
                'content' => $section->content,
                'background_settings' => $section->background_settings,
            ];
        });

        $translation = $page->translations->firstWhere('locale', $locale) 
            ?? $page->translations->firstWhere('locale', 'en')
            ?? $page->translations->first();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $page->id,
                'slug' => $page->slug,
                'is_published' => $page->is_published,
                'published_at' => $page->published_at,
                'title' => $translation?->title,
                'meta_title' => $translation?->meta_title,
                'meta_description' => $translation?->meta_description,
                'og_image' => $translation?->og_image,
                'translations' => $page->translations,
                'sections' => $sections,
                'settings' => $page->settings,
            ],
        ]);
    }
}
