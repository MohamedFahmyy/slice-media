<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Page;
use App\Models\PageRevision;
use App\Models\PageSection;
use App\Models\PageTranslation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PageController extends Controller
{
    public function index(): JsonResponse
    {
        $pages = Page::with(['translations', 'author:id,name', 'lastEditor:id,name'])
            ->withCount('sections')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pages,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $page = Page::with([
            'translations',
            'sections' => fn($q) => $q->orderBy('order'),
            'revisions' => fn($q) => $q->latest()->limit(10),
            'author:id,name',
            'lastEditor:id,name',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $page,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:100', 'unique:pages,slug'],
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'meta_description_en' => ['nullable', 'string', 'max:1000'],
            'meta_description_ar' => ['nullable', 'string', 'max:1000'],
            'settings' => ['nullable', 'array'],
        ]);

        return DB::transaction(function () use ($validated, $user) {
            $page = Page::create([
                'slug' => $validated['slug'],
                'is_published' => false,
                'author_id' => $user->id,
                'last_editor_id' => $user->id,
                'settings' => $validated['settings'] ?? [],
            ]);

            PageTranslation::create([
                'page_id' => $page->id,
                'locale' => 'en',
                'title' => $validated['title_en'],
                'meta_description' => $validated['meta_description_en'] ?? null,
            ]);

            PageTranslation::create([
                'page_id' => $page->id,
                'locale' => 'ar',
                'title' => $validated['title_ar'],
                'meta_description' => $validated['meta_description_ar'] ?? null,
            ]);

            AuditLog::log('page_created', $page, null, $page->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Page created as draft.',
                'data' => $page->load('translations'),
            ], 201);
        });
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:100', 'unique:pages,slug,' . $id],
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'meta_title_en' => ['nullable', 'string', 'max:255'],
            'meta_title_ar' => ['nullable', 'string', 'max:255'],
            'meta_description_en' => ['nullable', 'string', 'max:1000'],
            'meta_description_ar' => ['nullable', 'string', 'max:1000'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'settings' => ['nullable', 'array'],
        ]);

        DB::transaction(function () use ($page, $validated, $user) {
            $page->update([
                'slug' => $validated['slug'],
                'last_editor_id' => $user->id,
                'settings' => $validated['settings'] ?? $page->settings,
            ]);

            PageTranslation::updateOrCreate([
                'page_id' => $page->id,
                'locale' => 'en',
            ], [
                'title' => $validated['title_en'],
                'meta_title' => $validated['meta_title_en'] ?? null,
                'meta_description' => $validated['meta_description_en'] ?? null,
                'og_image' => $validated['og_image'] ?? null,
            ]);

            PageTranslation::updateOrCreate([
                'page_id' => $page->id,
                'locale' => 'ar',
            ], [
                'title' => $validated['title_ar'],
                'meta_title' => $validated['meta_title_ar'] ?? null,
                'meta_description' => $validated['meta_description_ar'] ?? null,
                'og_image' => $validated['og_image'] ?? null,
            ]);
        });

        AuditLog::log('page_updated', $page);

        return response()->json([
            'success' => true,
            'message' => 'Page settings updated successfully.',
            'data' => $page->fresh(['translations', 'sections']),
        ]);
    }

    public function saveSections(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'sections' => ['required', 'array'],
            'sections.*.section_type' => ['required', 'string'],
            'sections.*.order' => ['required', 'integer'],
            'sections.*.is_enabled' => ['required', 'boolean'],
            'sections.*.layout_variant' => ['nullable', 'string'],
            'sections.*.content' => ['required', 'array'],
            'sections.*.background_settings' => ['nullable', 'array'],
            'revision_notes' => ['nullable', 'string', 'max:500'],
        ]);

        return DB::transaction(function () use ($page, $validated, $user) {
            // Delete old sections and recreate
            $page->sections()->delete();

            foreach ($validated['sections'] as $sData) {
                PageSection::create([
                    'page_id' => $page->id,
                    'section_type' => $sData['section_type'],
                    'order' => $sData['order'],
                    'is_enabled' => $sData['is_enabled'],
                    'layout_variant' => $sData['layout_variant'] ?? null,
                    'content' => $sData['content'],
                    'background_settings' => $sData['background_settings'] ?? null,
                ]);
            }

            $page->update(['last_editor_id' => $user->id]);

            // Save Revision Snapshot
            $currentVersion = ($page->revisions()->max('version') ?? 0) + 1;
            $snapshot = [
                'page' => $page->only(['id', 'slug', 'settings']),
                'translations' => $page->translations->toArray(),
                'sections' => $page->sections()->orderBy('order')->get()->toArray(),
            ];

            PageRevision::create([
                'page_id' => $page->id,
                'version' => $currentVersion,
                'snapshot' => $snapshot,
                'creator_id' => $user->id,
                'notes' => $validated['revision_notes'] ?? "Saved draft version {$currentVersion}",
            ]);

            AuditLog::log('page_sections_saved', $page, null, ['version' => $currentVersion]);

            return response()->json([
                'success' => true,
                'message' => "Sections saved successfully as Revision v{$currentVersion}.",
                'version' => $currentVersion,
                'sections' => $page->sections()->orderBy('order')->get(),
            ]);
        });
    }

    public function publish(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $page = Page::with('sections')->findOrFail($id);

        if ($page->sections->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot publish a page without any sections.',
            ], 422);
        }

        $page->update([
            'is_published' => true,
            'published_at' => now(),
            'last_editor_id' => $user->id,
        ]);

        AuditLog::log('page_published', $page);

        return response()->json([
            'success' => true,
            'message' => 'Page published live successfully.',
            'published_at' => $page->published_at,
        ]);
    }

    public function unpublish(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $page = Page::findOrFail($id);

        $page->update([
            'is_published' => false,
            'last_editor_id' => $user->id,
        ]);

        AuditLog::log('page_unpublished', $page);

        return response()->json([
            'success' => true,
            'message' => 'Page unpublished (returned to draft status).',
        ]);
    }

    public function restoreRevision(Request $request, int $id, int $revisionId): JsonResponse
    {
        $user = $request->user();
        $page = Page::findOrFail($id);
        $revision = PageRevision::where('page_id', $id)->findOrFail($revisionId);

        $snapshot = $revision->snapshot;

        DB::transaction(function () use ($page, $snapshot, $user) {
            // Restore sections
            $page->sections()->delete();
            if (!empty($snapshot['sections'])) {
                foreach ($snapshot['sections'] as $s) {
                    PageSection::create([
                        'page_id' => $page->id,
                        'section_type' => $s['section_type'],
                        'order' => $s['order'],
                        'is_enabled' => $s['is_enabled'],
                        'layout_variant' => $s['layout_variant'] ?? null,
                        'content' => $s['content'],
                        'background_settings' => $s['background_settings'] ?? null,
                    ]);
                }
            }
            $page->update(['last_editor_id' => $user->id]);
        });

        AuditLog::log('page_revision_restored', $page, null, ['revision_id' => $revisionId, 'version' => $revision->version]);

        return response()->json([
            'success' => true,
            'message' => "Page rolled back successfully to Revision v{$revision->version}.",
            'data' => $page->fresh(['translations', 'sections']),
        ]);
    }
}
