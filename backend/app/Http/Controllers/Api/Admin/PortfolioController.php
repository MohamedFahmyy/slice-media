<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\PortfolioProject;
use App\Models\PortfolioTranslation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PortfolioController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = PortfolioProject::with('translations')->orderBy('order')->get();

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:100', 'unique:portfolio_projects,slug'],
            'client_name' => ['required', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'summary_en' => ['required', 'string'],
            'summary_ar' => ['required', 'string'],
            'challenge_en' => ['nullable', 'string'],
            'challenge_ar' => ['nullable', 'string'],
            'strategy_en' => ['nullable', 'string'],
            'strategy_ar' => ['nullable', 'string'],
            'execution_en' => ['nullable', 'string'],
            'execution_ar' => ['nullable', 'string'],
            'outcomes_en' => ['nullable', 'string'],
            'outcomes_ar' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'string'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'order' => ['nullable', 'integer'],
        ]);

        return DB::transaction(function () use ($validated) {
            $project = PortfolioProject::create([
                'slug' => $validated['slug'],
                'client_name' => $validated['client_name'],
                'industry' => $validated['industry'] ?? null,
                'featured_image' => $validated['featured_image'] ?? null,
                'is_featured' => $validated['is_featured'] ?? false,
                'is_published' => $validated['is_published'] ?? true,
                'published_at' => ($validated['is_published'] ?? true) ? now() : null,
                'order' => $validated['order'] ?? (PortfolioProject::max('order') + 1),
            ]);

            PortfolioTranslation::create([
                'portfolio_project_id' => $project->id,
                'locale' => 'en',
                'title' => $validated['title_en'],
                'summary' => $validated['summary_en'],
                'challenge' => $validated['challenge_en'] ?? null,
                'strategy' => $validated['strategy_en'] ?? null,
                'execution' => $validated['execution_en'] ?? null,
                'outcomes' => $validated['outcomes_en'] ?? null,
            ]);

            PortfolioTranslation::create([
                'portfolio_project_id' => $project->id,
                'locale' => 'ar',
                'title' => $validated['title_ar'],
                'summary' => $validated['summary_ar'],
                'challenge' => $validated['challenge_ar'] ?? null,
                'strategy' => $validated['strategy_ar'] ?? null,
                'execution' => $validated['execution_ar'] ?? null,
                'outcomes' => $validated['outcomes_ar'] ?? null,
            ]);

            AuditLog::log('portfolio_created', $project);

            return response()->json([
                'success' => true,
                'message' => 'Portfolio case study created successfully.',
                'data' => $project->load('translations'),
            ], 201);
        });
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $project = PortfolioProject::findOrFail($id);

        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:100', 'unique:portfolio_projects,slug,' . $id],
            'client_name' => ['required', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'summary_en' => ['required', 'string'],
            'summary_ar' => ['required', 'string'],
            'challenge_en' => ['nullable', 'string'],
            'challenge_ar' => ['nullable', 'string'],
            'strategy_en' => ['nullable', 'string'],
            'strategy_ar' => ['nullable', 'string'],
            'execution_en' => ['nullable', 'string'],
            'execution_ar' => ['nullable', 'string'],
            'outcomes_en' => ['nullable', 'string'],
            'outcomes_ar' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'string'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'order' => ['nullable', 'integer'],
        ]);

        DB::transaction(function () use ($project, $validated) {
            $project->update([
                'slug' => $validated['slug'],
                'client_name' => $validated['client_name'],
                'industry' => $validated['industry'] ?? $project->industry,
                'featured_image' => $validated['featured_image'] ?? $project->featured_image,
                'is_featured' => $validated['is_featured'] ?? $project->is_featured,
                'is_published' => $validated['is_published'] ?? $project->is_published,
                'order' => $validated['order'] ?? $project->order,
            ]);

            PortfolioTranslation::updateOrCreate([
                'portfolio_project_id' => $project->id,
                'locale' => 'en',
            ], [
                'title' => $validated['title_en'],
                'summary' => $validated['summary_en'],
                'challenge' => $validated['challenge_en'] ?? null,
                'strategy' => $validated['strategy_en'] ?? null,
                'execution' => $validated['execution_en'] ?? null,
                'outcomes' => $validated['outcomes_en'] ?? null,
            ]);

            PortfolioTranslation::updateOrCreate([
                'portfolio_project_id' => $project->id,
                'locale' => 'ar',
            ], [
                'title' => $validated['title_ar'],
                'summary' => $validated['summary_ar'],
                'challenge' => $validated['challenge_ar'] ?? null,
                'strategy' => $validated['strategy_ar'] ?? null,
                'execution' => $validated['execution_ar'] ?? null,
                'outcomes' => $validated['outcomes_ar'] ?? null,
            ]);
        });

        AuditLog::log('portfolio_updated', $project);

        return response()->json([
            'success' => true,
            'message' => 'Portfolio case study updated successfully.',
            'data' => $project->fresh('translations'),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $project = PortfolioProject::findOrFail($id);
        $project->delete();

        AuditLog::log('portfolio_deleted', null, ['id' => $id, 'slug' => $project->slug]);

        return response()->json([
            'success' => true,
            'message' => 'Portfolio case study deleted successfully.',
        ]);
    }
}
