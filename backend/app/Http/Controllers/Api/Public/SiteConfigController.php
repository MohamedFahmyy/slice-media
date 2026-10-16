<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\NavigationMenu;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteConfigController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $locale = $request->query('locale', 'en');

        $branding = SiteSetting::getValue('branding', []);
        $contact = SiteSetting::getValue('contact_info', []);
        $social = SiteSetting::getValue('social_links', []);
        $seo = SiteSetting::getValue('seo_defaults', []);

        $headerMenu = NavigationMenu::where('location', 'header')->first();
        $footerMenu = NavigationMenu::where('location', 'footer')->first();

        return response()->json([
            'success' => true,
            'data' => [
                'branding' => $branding,
                'contact' => $contact,
                'social' => $social,
                'seo' => $seo,
                'navigation' => [
                    'header' => $headerMenu ? $headerMenu->items : [],
                    'footer' => $footerMenu ? $footerMenu->items : [],
                ],
                'locale' => $locale,
            ],
        ]);
    }
}
