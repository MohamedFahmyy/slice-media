<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Define permissions list
        $permissions = [
            // Dashboard
            ['slug' => 'dashboard.view', 'name' => 'View Dashboard Overview', 'group' => 'dashboard', 'description' => 'Access executive metrics and analytics'],
            
            // Pages & CMS
            ['slug' => 'pages.view', 'name' => 'View Pages', 'group' => 'pages', 'description' => 'View list of CMS pages'],
            ['slug' => 'pages.create', 'name' => 'Create Pages', 'group' => 'pages', 'description' => 'Create new CMS pages and drafts'],
            ['slug' => 'pages.update', 'name' => 'Edit Pages', 'group' => 'pages', 'description' => 'Edit page content and sections'],
            ['slug' => 'pages.publish', 'name' => 'Publish Pages', 'group' => 'pages', 'description' => 'Publish or unpublish CMS pages'],
            ['slug' => 'pages.delete', 'name' => 'Delete Pages', 'group' => 'pages', 'description' => 'Delete or archive CMS pages'],

            // Media
            ['slug' => 'media.view', 'name' => 'View Media', 'group' => 'media', 'description' => 'Browse media library'],
            ['slug' => 'media.upload', 'name' => 'Upload Media', 'group' => 'media', 'description' => 'Upload assets to media library'],
            ['slug' => 'media.delete', 'name' => 'Delete Media', 'group' => 'media', 'description' => 'Delete files from media library'],

            // Content Entities
            ['slug' => 'services.manage', 'name' => 'Manage Services', 'group' => 'content', 'description' => 'Create, edit, and reorder agency services'],
            ['slug' => 'portfolio.manage', 'name' => 'Manage Portfolio', 'group' => 'content', 'description' => 'Create and edit case studies'],
            ['slug' => 'videos.manage', 'name' => 'Manage Videos', 'group' => 'content', 'description' => 'Manage 3D video strip and video showcases'],

            // Leads & CRM
            ['slug' => 'leads.view', 'name' => 'View Leads', 'group' => 'crm', 'description' => 'View incoming client inquiries'],
            ['slug' => 'leads.create', 'name' => 'Create Leads', 'group' => 'crm', 'description' => 'Manually log incoming opportunities'],
            ['slug' => 'leads.update', 'name' => 'Update Leads', 'group' => 'crm', 'description' => 'Change lead status, notes, and values'],
            ['slug' => 'leads.assign', 'name' => 'Assign Leads', 'group' => 'crm', 'description' => 'Assign leads to sales agents'],
            ['slug' => 'leads.export', 'name' => 'Export Leads', 'group' => 'crm', 'description' => 'Export lead data to CSV'],
            ['slug' => 'leads.delete', 'name' => 'Delete Leads', 'group' => 'crm', 'description' => 'Delete or archive client leads'],

            // Users & RBAC
            ['slug' => 'users.manage', 'name' => 'Manage Users', 'group' => 'admin', 'description' => 'Create and edit staff users'],
            ['slug' => 'roles.manage', 'name' => 'Manage Roles', 'group' => 'admin', 'description' => 'Configure roles and permissions'],
            ['slug' => 'settings.manage', 'name' => 'Manage Settings', 'group' => 'settings', 'description' => 'Manage global site and brand settings'],
            ['slug' => 'seo.manage', 'name' => 'Manage SEO', 'group' => 'seo', 'description' => 'Configure global SEO and tracking'],
            ['slug' => 'activity.view', 'name' => 'View Activity Logs', 'group' => 'audit', 'description' => 'Inspect administrative audit trails'],
        ];

        $permissionModels = [];
        foreach ($permissions as $perm) {
            $permissionModels[$perm['slug']] = Permission::updateOrCreate(
                ['slug' => $perm['slug']],
                $perm
            );
        }

        // 2. Define Roles
        $superAdminRole = Role::updateOrCreate(['slug' => 'super-admin'], [
            'name' => 'Super Admin',
            'description' => 'Unrestricted access to all system capabilities and server configurations',
        ]);
        $superAdminRole->permissions()->sync(array_values(array_map(fn($p) => $p->id, $permissionModels)));

        $adminRole = Role::updateOrCreate(['slug' => 'administrator'], [
            'name' => 'Administrator',
            'description' => 'Full administrative access except root system overrides',
        ]);
        $adminPerms = array_filter($permissionModels, fn($p) => !in_array($p->slug, ['roles.manage']));
        $adminRole->permissions()->sync(array_map(fn($p) => $p->id, $adminPerms));

        $contentRole = Role::updateOrCreate(['slug' => 'content-manager'], [
            'name' => 'Content Manager',
            'description' => 'Manages pages, media, services, portfolio, and videos',
        ]);
        $contentPerms = array_filter($permissionModels, fn($p) => in_array($p->slug, [
            'dashboard.view', 'pages.view', 'pages.create', 'pages.update', 'pages.publish',
            'media.view', 'media.upload', 'media.delete', 'services.manage', 'portfolio.manage',
            'videos.manage', 'seo.manage',
        ]));
        $contentRole->permissions()->sync(array_map(fn($p) => $p->id, $contentPerms));

        $salesManagerRole = Role::updateOrCreate(['slug' => 'sales-manager'], [
            'name' => 'Sales Manager',
            'description' => 'Oversees all incoming leads, pipelines, assignments, and sales metrics',
        ]);
        $salesMgrPerms = array_filter($permissionModels, fn($p) => in_array($p->slug, [
            'dashboard.view', 'leads.view', 'leads.create', 'leads.update', 'leads.assign', 'leads.export',
        ]));
        $salesManagerRole->permissions()->sync(array_map(fn($p) => $p->id, $salesMgrPerms));

        $salesAgentRole = Role::updateOrCreate(['slug' => 'sales-agent'], [
            'name' => 'Sales Agent',
            'description' => 'Handles assigned leads, updates status, and adds client meeting notes',
        ]);
        $salesAgentPerms = array_filter($permissionModels, fn($p) => in_array($p->slug, [
            'dashboard.view', 'leads.view', 'leads.update',
        ]));
        $salesAgentRole->permissions()->sync(array_map(fn($p) => $p->id, $salesAgentPerms));

        $analystRole = Role::updateOrCreate(['slug' => 'analyst'], [
            'name' => 'Analyst / Read Only',
            'description' => 'Read-only access to dashboard metrics and lead reports',
        ]);
        $analystPerms = array_filter($permissionModels, fn($p) => in_array($p->slug, [
            'dashboard.view', 'leads.view', 'pages.view', 'media.view', 'activity.view',
        ]));
        $analystRole->permissions()->sync(array_map(fn($p) => $p->id, $analystPerms));

        // 3. Create Seeded Initial Accounts
        $superAdminUser = User::updateOrCreate(
            ['email' => 'superadmin@slicemedia.agency'],
            [
                'name' => 'Slice Super Admin',
                'password' => Hash::make('SliceAdmin#2026!'),
                'role_id' => $superAdminRole->id,
                'status' => 'active',
                'phone' => '+20 100 000 0001',
            ]
        );
        $superAdminUser->roles()->sync([$superAdminRole->id]);

        $contentUser = User::updateOrCreate(
            ['email' => 'content@slicemedia.agency'],
            [
                'name' => 'Farah Content Lead',
                'password' => Hash::make('SliceContent#2026!'),
                'role_id' => $contentRole->id,
                'status' => 'active',
                'phone' => '+20 100 000 0002',
            ]
        );
        $contentUser->roles()->sync([$contentRole->id]);

        $salesMgrUser = User::updateOrCreate(
            ['email' => 'sales.mgr@slicemedia.agency'],
            [
                'name' => 'Karim Sales Director',
                'password' => Hash::make('SliceSales#2026!'),
                'role_id' => $salesManagerRole->id,
                'status' => 'active',
                'phone' => '+971 50 000 0001',
            ]
        );
        $salesMgrUser->roles()->sync([$salesManagerRole->id]);

        $salesAgentUser = User::updateOrCreate(
            ['email' => 'agent.omar@slicemedia.agency'],
            [
                'name' => 'Omar Client Strategist',
                'password' => Hash::make('SliceAgent#2026!'),
                'role_id' => $salesAgentRole->id,
                'status' => 'active',
                'phone' => '+20 100 000 0003',
            ]
        );
        $salesAgentUser->roles()->sync([$salesAgentRole->id]);
    }
}
