<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\Page;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SliceApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_public_site_config_endpoint_returns_data(): void
    {
        $response = $this->getJson('/api/v1/site-config');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'branding',
                    'contact',
                    'social',
                    'seo',
                    'navigation',
                ],
            ]);
    }

    public function test_public_services_and_portfolio_and_videos(): void
    {
        $servicesRes = $this->getJson('/api/v1/services');
        $servicesRes->assertStatus(200)->assertJson(['success' => true]);

        $portfolioRes = $this->getJson('/api/v1/portfolio');
        $portfolioRes->assertStatus(200)->assertJson(['success' => true]);

        $videosRes = $this->getJson('/api/v1/videos');
        $videosRes->assertStatus(200)->assertJson(['success' => true]);
    }

    public function test_public_lead_submission_persists_in_database(): void
    {
        $payload = [
            'full_name' => 'Automated Test Client',
            'email' => 'test.client@example.com',
            'phone' => '+201009998877',
            'company' => 'Pyramids Retail Co',
            'requested_service' => 'Viral Content Creation & Video Formats',
            'budget_range' => '$5,000 - $10,000 / month',
            'project_description' => 'Need 15 high-retention short reels for Q4 product launch.',
            'preferred_language' => 'en',
            'utm_source' => 'google_ads',
            'utm_campaign' => 'viral_reels_cairo',
        ];

        $response = $this->postJson('/api/v1/leads', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'reference_code',
                'message',
            ]);

        $this->assertDatabaseHas('leads', [
            'email' => 'test.client@example.com',
            'company' => 'Pyramids Retail Co',
            'status' => 'new',
        ]);
    }

    public function test_lead_submission_fails_with_invalid_data(): void
    {
        $response = $this->postJson('/api/v1/leads', [
            'full_name' => '',
            'email' => 'not-an-email',
            'project_description' => 'short',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['full_name', 'email', 'project_description']);
    }

    public function test_admin_login_with_valid_and_invalid_credentials(): void
    {
        // 1. Invalid credentials
        $failRes = $this->postJson('/api/v1/admin/auth/login', [
            'email' => 'superadmin@slicemedia.agency',
            'password' => 'WrongPassword123!',
        ]);
        $failRes->assertStatus(422);

        // 2. Valid credentials
        $successRes = $this->postJson('/api/v1/admin/auth/login', [
            'email' => 'superadmin@slicemedia.agency',
            'password' => 'SliceAdmin#2026!',
        ]);

        $successRes->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'token',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                    'permissions',
                ],
            ]);
    }

    public function test_unauthenticated_request_to_admin_is_blocked(): void
    {
        $response = $this->getJson('/api/v1/admin/dashboard');
        $response->assertStatus(401);
    }

    public function test_authenticated_admin_can_access_dashboard_metrics(): void
    {
        $admin = User::where('email', 'superadmin@slicemedia.agency')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'metrics' => [
                        'total_leads',
                        'new_leads',
                        'won_leads',
                        'pipeline_value',
                    ],
                    'leads_by_status',
                    'leads_timeline',
                    'cms_stats',
                ],
            ]);
    }

    public function test_sales_agent_lead_ownership_restriction(): void
    {
        $salesAgent = User::where('email', 'agent.omar@slicemedia.agency')->first();
        $this->assertNotNull($salesAgent);

        // Omar should only see leads assigned to him
        $response = $this->actingAs($salesAgent, 'sanctum')->getJson('/api/v1/admin/leads');

        $response->assertStatus(200);
        $leads = $response->json('data.data');

        foreach ($leads as $lead) {
            $this->assertEquals($salesAgent->id, $lead['assigned_to']);
        }
    }

    public function test_draft_page_isolation_from_public_endpoint(): void
    {
        $admin = User::where('email', 'superadmin@slicemedia.agency')->first();

        // Create an unpublished draft page
        $createRes = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/pages', [
            'slug' => 'secret-campaign-draft',
            'title_en' => 'Top Secret Campaign',
            'title_ar' => 'حملة سرية تجريبية',
        ]);
        $createRes->assertStatus(201);
        $pageId = $createRes->json('data.id');

        // Public request as unauthenticated guest should return 404
        auth('sanctum')->forgetUser();
        auth()->forgetGuards();
        $publicRes = $this->getJson('/api/v1/pages/secret-campaign-draft');
        $publicRes->assertStatus(404);

        // Add section and publish
        $this->actingAs($admin, 'sanctum')->putJson("/api/v1/admin/pages/{$pageId}/sections", [
            'sections' => [
                [
                    'section_type' => 'hero',
                    'order' => 1,
                    'is_enabled' => true,
                    'content' => ['headline_en' => 'Now Live!'],
                ],
            ],
        ])->assertStatus(200);

        $this->actingAs($admin, 'sanctum')->postJson("/api/v1/admin/pages/{$pageId}/publish")
            ->assertStatus(200);

        // Now public request should return 200
        $liveRes = $this->getJson('/api/v1/pages/secret-campaign-draft');
        $liveRes->assertStatus(200)->assertJson(['success' => true]);
    }
}
