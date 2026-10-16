<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Service;
use App\Models\ServiceTranslation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $services = Service::with('translations')->orderBy('order')->get();

        return response()->json([
            'success' => true,
            'data' => $services,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:100', 'unique:services,slug'],
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'description_en' => ['required', 'string'],
            'description_ar' => ['required', 'string'],
            'details_en' => ['nullable', 'string'],
            'details_ar' => ['nullable', 'string'],
            'duration_en' => ['nullable', 'string', 'max:100'],
            'duration_ar' => ['nullable', 'string', 'max:100'],
            'deliverables' => ['nullable', 'array'],
            'order' => ['nullable', 'integer'],
            'is_visible' => ['boolean'],
        ]);

        return DB::transaction(function () use ($validated) {
            $service = Service::create([
                'slug' => $validated['slug'],
                'order' => $validated['order'] ?? (Service::max('order') + 1),
                'duration_en' => $validated['duration_en'] ?? null,
                'duration_ar' => $validated['duration_ar'] ?? null,
                'deliverables' => $validated['deliverables'] ?? [],
                'is_visible' => $validated['is_visible'] ?? true,
            ]);

            ServiceTranslation::create([
                'service_id' => $service->id,
                'locale' => 'en',
                'title' => $validated['title_en'],
                'description' => $validated['description_en'],
                'details' => $validated['details_en'] ?? null,
            ]);

            ServiceTranslation::create([
                'service_id' => $service->id,
                'locale' => 'ar',
                'title' => $validated['title_ar'],
                'description' => $validated['description_ar'],
                'details' => $validated['details_ar'] ?? null,
            ]);

            AuditLog::log('service_created', $service);

            return response()->json([
                'success' => true,
                'message' => 'Service created successfully.',
                'data' => $service->load('translations'),
            ], 201);
        });
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:100', 'unique:services,slug,' . $id],
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'description_en' => ['required', 'string'],
            'description_ar' => ['required', 'string'],
            'details_en' => ['nullable', 'string'],
            'details_ar' => ['nullable', 'string'],
            'duration_en' => ['nullable', 'string', 'max:100'],
            'duration_ar' => ['nullable', 'string', 'max:100'],
            'deliverables' => ['nullable', 'array'],
            'order' => ['nullable', 'integer'],
            'is_visible' => ['boolean'],
        ]);

        DB::transaction(function () use ($service, $validated) {
            $service->update([
                'slug' => $validated['slug'],
                'order' => $validated['order'] ?? $service->order,
                'duration_en' => $validated['duration_en'] ?? $service->duration_en,
                'duration_ar' => $validated['duration_ar'] ?? $service->duration_ar,
                'deliverables' => $validated['deliverables'] ?? $service->deliverables,
                'is_visible' => $validated['is_visible'] ?? $service->is_visible,
            ]);

            ServiceTranslation::updateOrCreate([
                'service_id' => $service->id,
                'locale' => 'en',
            ], [
                'title' => $validated['title_en'],
                'description' => $validated['description_en'],
                'details' => $validated['details_en'] ?? null,
            ]);

            ServiceTranslation::updateOrCreate([
                'service_id' => $service->id,
                'locale' => 'ar',
            ], [
                'title' => $validated['title_ar'],
                'description' => $validated['description_ar'],
                'details' => $validated['details_ar'] ?? null,
            ]);
        });

        AuditLog::log('service_updated', $service);

        return response()->json([
            'success' => true,
            'message' => 'Service updated successfully.',
            'data' => $service->fresh('translations'),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $service = Service::findOrFail($id);
        $service->delete();

        AuditLog::log('service_deleted', null, ['id' => $id, 'slug' => $service->slug]);

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully.',
        ]);
    }
}
