<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LeadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:255'],
            'requested_service' => ['nullable', 'string', 'max:255'],
            'budget_range' => ['nullable', 'string', 'max:100'],
            'project_description' => ['required', 'string', 'min:10', 'max:5000'],
            'preferred_language' => ['nullable', 'string', 'in:en,ar'],
            'referring_page' => ['nullable', 'string', 'max:500'],
            'utm_source' => ['nullable', 'string', 'max:100'],
            'utm_medium' => ['nullable', 'string', 'max:100'],
            'utm_campaign' => ['nullable', 'string', 'max:100'],
            'utm_term' => ['nullable', 'string', 'max:100'],
            'utm_content' => ['nullable', 'string', 'max:100'],
        ]);

        // Generate unique reference code
        do {
            $refCode = 'SLC-' . strtoupper(Str::random(5));
        } while (Lead::where('reference_code', $refCode)->exists());

        $lead = Lead::create([
            'reference_code' => $refCode,
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'company' => $validated['company'] ?? null,
            'requested_service' => $validated['requested_service'] ?? null,
            'budget_range' => $validated['budget_range'] ?? null,
            'project_description' => $validated['project_description'],
            'preferred_language' => $validated['preferred_language'] ?? 'en',
            'status' => 'new',
            'priority' => 'medium',
            'source' => 'website_contact',
            'referring_page' => $validated['referring_page'] ?? null,
            'utm_source' => $validated['utm_source'] ?? null,
            'utm_medium' => $validated['utm_medium'] ?? null,
            'utm_campaign' => $validated['utm_campaign'] ?? null,
            'utm_term' => $validated['utm_term'] ?? null,
            'utm_content' => $validated['utm_content'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Log initial activity
        LeadActivity::create([
            'lead_id' => $lead->id,
            'action_type' => 'created',
            'description' => "Client inquiry submitted via website. Reference ID: {$refCode}.",
            'metadata' => [
                'source' => 'website_contact',
                'service' => $lead->requested_service,
                'budget' => $lead->budget_range,
            ],
        ]);

        return response()->json([
            'success' => true,
            'reference_code' => $refCode,
            'message' => 'Thank you! Your strategic campaign inquiry has been received. Our Creative Directors will review it within 24 hours.',
            'message_ar' => 'شكراً لك! تم استلام طلبك بنجاح. سيقوم فريقنا الإبداعي بمراجعة التفاصيل والرد عليك خلال 24 ساعة.',
        ], 201);
    }
}
