<?php

use App\Http\Controllers\Api\Admin\ActivityController as AdminActivityController;
use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\LeadController as AdminLeadController;
use App\Http\Controllers\Api\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Api\Admin\PageController as AdminPageController;
use App\Http\Controllers\Api\Admin\PortfolioController as AdminPortfolioController;
use App\Http\Controllers\Api\Admin\RoleController as AdminRoleController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\VideoController as AdminVideoController;
use App\Http\Controllers\Api\Public\LeadController as PublicLeadController;
use App\Http\Controllers\Api\Public\PageController as PublicPageController;
use App\Http\Controllers\Api\Public\PortfolioController as PublicPortfolioController;
use App\Http\Controllers\Api\Public\ServiceController as PublicServiceController;
use App\Http\Controllers\Api\Public\SiteConfigController as PublicSiteConfigController;
use App\Http\Controllers\Api\Public\VideoController as PublicVideoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Version 1 API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // --- 1. Public Content & Capture Endpoints ---
    Route::get('/site-config', [PublicSiteConfigController::class, 'show']);
    Route::get('/pages/{slug}', [PublicPageController::class, 'show']);
    Route::get('/services', [PublicServiceController::class, 'index']);
    Route::get('/services/{slug}', [PublicServiceController::class, 'show']);
    Route::get('/portfolio', [PublicPortfolioController::class, 'index']);
    Route::get('/portfolio/{slug}', [PublicPortfolioController::class, 'show']);
    Route::get('/videos', [PublicVideoController::class, 'index']);
    Route::post('/leads', [PublicLeadController::class, 'store'])->middleware('throttle:10,1');

    // --- 2. Admin Authentication ---
    Route::prefix('admin/auth')->group(function () {
        Route::post('/login', [AdminAuthController::class, 'login'])->middleware('throttle:10,1');

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AdminAuthController::class, 'me']);
            Route::post('/logout', [AdminAuthController::class, 'logout']);
            Route::put('/profile', [AdminAuthController::class, 'updateProfile']);
        });
    });

    // --- 3. Protected Administration Dashboard & CMS & CRM ---
    Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {

        // Executive Overview
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->middleware('permission:dashboard.view');

        // Lead CRM
        Route::prefix('leads')->group(function () {
            Route::get('/export/csv', [AdminLeadController::class, 'exportCsv'])->middleware('permission:leads.export');
            Route::get('/', [AdminLeadController::class, 'index'])->middleware('permission:leads.view');
            Route::get('/{id}', [AdminLeadController::class, 'show'])->middleware('permission:leads.view');
            Route::patch('/{id}', [AdminLeadController::class, 'update'])->middleware('permission:leads.update');
            Route::post('/{id}/assign', [AdminLeadController::class, 'assign'])->middleware('permission:leads.assign');
            Route::post('/{id}/notes', [AdminLeadController::class, 'addNote'])->middleware('permission:leads.update');
        });

        // CMS Pages & Visual Builder
        Route::prefix('pages')->group(function () {
            Route::get('/', [AdminPageController::class, 'index'])->middleware('permission:pages.view');
            Route::post('/', [AdminPageController::class, 'store'])->middleware('permission:pages.create');
            Route::get('/{id}', [AdminPageController::class, 'show'])->middleware('permission:pages.view');
            Route::put('/{id}', [AdminPageController::class, 'update'])->middleware('permission:pages.update');
            Route::put('/{id}/sections', [AdminPageController::class, 'saveSections'])->middleware('permission:pages.update');
            Route::post('/{id}/publish', [AdminPageController::class, 'publish'])->middleware('permission:pages.publish');
            Route::post('/{id}/unpublish', [AdminPageController::class, 'unpublish'])->middleware('permission:pages.publish');
            Route::post('/{id}/restore/{revisionId}', [AdminPageController::class, 'restoreRevision'])->middleware('permission:pages.update');
        });

        // Media Library
        Route::prefix('media')->group(function () {
            Route::get('/', [AdminMediaController::class, 'index'])->middleware('permission:media.view');
            Route::post('/', [AdminMediaController::class, 'store'])->middleware('permission:media.upload');
            Route::put('/{id}', [AdminMediaController::class, 'update'])->middleware('permission:media.view');
            Route::delete('/{id}', [AdminMediaController::class, 'destroy'])->middleware('permission:media.delete');
        });

        // Services Management
        Route::prefix('services')->group(function () {
            Route::get('/', [AdminServiceController::class, 'index'])->middleware('permission:services.manage');
            Route::post('/', [AdminServiceController::class, 'store'])->middleware('permission:services.manage');
            Route::put('/{id}', [AdminServiceController::class, 'update'])->middleware('permission:services.manage');
            Route::delete('/{id}', [AdminServiceController::class, 'destroy'])->middleware('permission:services.manage');
        });

        // Portfolio Management
        Route::prefix('portfolio')->group(function () {
            Route::get('/', [AdminPortfolioController::class, 'index'])->middleware('permission:portfolio.manage');
            Route::post('/', [AdminPortfolioController::class, 'store'])->middleware('permission:portfolio.manage');
            Route::put('/{id}', [AdminPortfolioController::class, 'update'])->middleware('permission:portfolio.manage');
            Route::delete('/{id}', [AdminPortfolioController::class, 'destroy'])->middleware('permission:portfolio.manage');
        });

        // Videos Showcase Management
        Route::prefix('videos')->group(function () {
            Route::get('/', [AdminVideoController::class, 'index'])->middleware('permission:videos.manage');
            Route::post('/', [AdminVideoController::class, 'store'])->middleware('permission:videos.manage');
            Route::put('/{id}', [AdminVideoController::class, 'update'])->middleware('permission:videos.manage');
            Route::delete('/{id}', [AdminVideoController::class, 'destroy'])->middleware('permission:videos.manage');
        });

        // Staff Users
        Route::prefix('users')->group(function () {
            Route::get('/', [AdminUserController::class, 'index'])->middleware('permission:users.manage');
            Route::post('/', [AdminUserController::class, 'store'])->middleware('permission:users.manage');
            Route::put('/{id}', [AdminUserController::class, 'update'])->middleware('permission:users.manage');
            Route::delete('/{id}', [AdminUserController::class, 'destroy'])->middleware('permission:users.manage');
        });

        // Roles & Permissions
        Route::prefix('roles')->group(function () {
            Route::get('/', [AdminRoleController::class, 'index'])->middleware('permission:roles.manage');
            Route::put('/{id}', [AdminRoleController::class, 'update'])->middleware('permission:roles.manage');
        });

        // Site Settings & Navigation
        Route::prefix('settings')->group(function () {
            Route::get('/', [AdminSettingController::class, 'index'])->middleware('permission:settings.manage');
            Route::put('/', [AdminSettingController::class, 'update'])->middleware('permission:settings.manage');
        });

        // Audit Trail Activity Logs
        Route::get('/activity', [AdminActivityController::class, 'index'])->middleware('permission:activity.view');
    });

});
