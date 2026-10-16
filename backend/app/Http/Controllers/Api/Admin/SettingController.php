<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\NavigationMenu;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = SiteSetting::all()->keyBy('key')->map(fn($s) => $s->value);
        $headerMenu = NavigationMenu::where('location', 'header')->first();
        $footerMenu = NavigationMenu::where('location', 'footer')->first();

        return response()->json([
            'success' => true,
            'data' => [
                'settings' => $settings,
                'navigation' => [
                    'header' => $headerMenu ? $headerMenu->items : [],
                    'footer' => $footerMenu ? $footerMenu->items : [],
                ],
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'branding' => ['nullable', 'array'],
            'contact_info' => ['nullable', 'array'],
            'social_links' => ['nullable', 'array'],
            'seo_defaults' => ['nullable', 'array'],
            'navigation_header' => ['nullable', 'array'],
            'navigation_footer' => ['nullable', 'array'],
        ]);

        if (isset($validated['branding'])) {
            SiteSetting::setValue('branding', $validated['branding'], 'branding');
        }
        if (isset($validated['contact_info'])) {
            SiteSetting::setValue('contact_info', $validated['contact_info'], 'contact');
        }
        if (isset($validated['social_links'])) {
            SiteSetting::setValue('social_links', $validated['social_links'], 'social');
        }
        if (isset($validated['seo_defaults'])) {
            SiteSetting::setValue('seo_defaults', $validated['seo_defaults'], 'seo');
        }

        if (isset($validated['navigation_header'])) {
            NavigationMenu::updateOrCreate(['location' => 'header'], [
                'name' => 'Main Navigation',
                'items' => $validated['navigation_header'],
            ]);
        }
        if (isset($validated['navigation_footer'])) {
            NavigationMenu::updateOrCreate(['location' => 'footer'], [
                'name' => 'Footer Navigation',
                'items' => $validated['navigation_footer'],
            ]);
        }

        AuditLog::log('settings_updated', null, null, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Site settings and navigation updated successfully.',
        ]);
    }
}
