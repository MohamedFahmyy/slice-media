<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Lead;
use App\Models\MediaAsset;
use App\Models\Page;
use App\Models\PortfolioProject;
use App\Models\Service;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Lead scope
        $leadQuery = Lead::query()->accessibleBy($user);

        $totalLeads = (clone $leadQuery)->count();
        $newLeads = (clone $leadQuery)->where('status', 'new')->count();
        $contactedLeads = (clone $leadQuery)->where('status', 'contacted')->count();
        $qualifiedLeads = (clone $leadQuery)->where('status', 'qualified')->count();
        $proposalSent = (clone $leadQuery)->where('status', 'proposal_sent')->count();
        $wonLeads = (clone $leadQuery)->where('status', 'won')->count();
        $lostLeads = (clone $leadQuery)->where('status', 'lost')->count();

        // Estimated Pipeline Value
        $totalPipelineValue = (clone $leadQuery)
            ->whereIn('status', ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation'])
            ->sum('estimated_deal_value');

        $wonPipelineValue = (clone $leadQuery)
            ->where('status', 'won')
            ->sum('estimated_deal_value');

        // Conversion Rate: won / (won + lost) * 100 (or won / total if no closed yet)
        $closedCount = $wonLeads + $lostLeads;
        $conversionRate = $closedCount > 0 
            ? round(($wonLeads / $closedCount) * 100, 1) 
            : ($totalLeads > 0 ? round(($wonLeads / $totalLeads) * 100, 1) : 0);

        // Leads by status
        $leadsByStatus = (clone $leadQuery)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        // Leads by requested service
        $leadsByService = (clone $leadQuery)
            ->select('requested_service', DB::raw('count(*) as count'))
            ->whereNotNull('requested_service')
            ->groupBy('requested_service')
            ->pluck('count', 'requested_service');

        // Leads timeline (last 7 days)
        $leadsTimeline = (clone $leadQuery)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(7)
            ->get();

        // Recent Audit / Activity logs
        $recentActivities = AuditLog::with('user:id,name,avatar')
            ->latest()
            ->limit(8)
            ->get();

        // CMS Overview counts
        $cmsStats = [
            'pages_count' => Page::count(),
            'published_pages' => Page::where('is_published', true)->count(),
            'services_count' => Service::count(),
            'portfolio_count' => PortfolioProject::count(),
            'videos_count' => Video::count(),
            'media_assets_count' => MediaAsset::count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'metrics' => [
                    'total_leads' => $totalLeads,
                    'new_leads' => $newLeads,
                    'contacted_leads' => $contactedLeads,
                    'qualified_leads' => $qualifiedLeads,
                    'proposal_sent' => $proposalSent,
                    'won_leads' => $wonLeads,
                    'lost_leads' => $lostLeads,
                    'conversion_rate_percentage' => $conversionRate,
                    'pipeline_value' => (float)$totalPipelineValue,
                    'won_revenue' => (float)$wonPipelineValue,
                ],
                'leads_by_status' => $leadsByStatus,
                'leads_by_service' => $leadsByService,
                'leads_timeline' => $leadsTimeline,
                'recent_activities' => $recentActivities,
                'cms_stats' => $cmsStats,
            ],
        ]);
    }
}
