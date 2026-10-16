<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Lead;
use App\Models\LeadActivity;
use App\Models\LeadNote;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LeadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $leads = Lead::with(['assignedAgent:id,name,email,avatar'])
            ->accessibleBy($user)
            ->filter($request->only(['search', 'status', 'priority', 'assigned_to', 'service', 'date_from', 'date_to']))
            ->orderBy('created_at', 'desc')
            ->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $leads,
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $lead = Lead::with([
            'assignedAgent:id,name,email,avatar',
            'notes.author:id,name,avatar',
            'activities.user:id,name,avatar',
        ])
        ->accessibleBy($user)
        ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $lead,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $lead = Lead::accessibleBy($user)->findOrFail($id);
        $oldValues = $lead->toArray();

        $validated = $request->validate([
            'status' => ['nullable', 'string', 'in:new,contacted,qualified,proposal_sent,negotiation,won,lost,archived'],
            'priority' => ['nullable', 'string', 'in:low,medium,high,urgent'],
            'estimated_deal_value' => ['nullable', 'numeric', 'min:0'],
            'full_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:255'],
            'requested_service' => ['nullable', 'string', 'max:255'],
            'budget_range' => ['nullable', 'string', 'max:100'],
            'project_description' => ['nullable', 'string', 'max:5000'],
            'lost_reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $statusChanged = isset($validated['status']) && $validated['status'] !== $lead->status;
        $oldStatus = $lead->status;

        if ($statusChanged && $validated['status'] === 'won') {
            $validated['won_at'] = now();
        } elseif ($statusChanged && $validated['status'] === 'lost') {
            $validated['lost_at'] = now();
        }

        $lead->update($validated);

        if ($statusChanged) {
            LeadActivity::create([
                'lead_id' => $lead->id,
                'user_id' => $user->id,
                'action_type' => 'status_changed',
                'description' => "Status changed from [{$oldStatus}] to [{$lead->status}] by {$user->name}.",
                'metadata' => [
                    'old_status' => $oldStatus,
                    'new_status' => $lead->status,
                ],
            ]);
        }

        AuditLog::log('lead_updated', $lead, $oldValues, $lead->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Lead updated successfully.',
            'data' => $lead->fresh(['assignedAgent:id,name,email,avatar']),
        ]);
    }

    public function assign(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        // Check if user has permission to assign leads
        if (!$user->hasPermission('leads.assign')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: You do not have permission to assign leads.',
            ], 403);
        }

        $validated = $request->validate([
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);

        $lead = Lead::findOrFail($id);
        $oldAgentId = $lead->assigned_to;
        $newAgent = $validated['assigned_to'] ? User::find($validated['assigned_to']) : null;

        $lead->update(['assigned_to' => $validated['assigned_to']]);

        LeadActivity::create([
            'lead_id' => $lead->id,
            'user_id' => $user->id,
            'action_type' => 'assigned',
            'description' => $newAgent 
                ? "Lead assigned to {$newAgent->name} by {$user->name}." 
                : "Lead assignment removed by {$user->name}.",
            'metadata' => [
                'old_agent_id' => $oldAgentId,
                'new_agent_id' => $validated['assigned_to'],
            ],
        ]);

        AuditLog::log('lead_assigned', $lead, ['assigned_to' => $oldAgentId], ['assigned_to' => $validated['assigned_to']]);

        return response()->json([
            'success' => true,
            'message' => $newAgent ? "Lead assigned to {$newAgent->name}." : "Lead assignment cleared.",
            'data' => $lead->fresh(['assignedAgent:id,name,email,avatar']),
        ]);
    }

    public function addNote(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $lead = Lead::accessibleBy($user)->findOrFail($id);

        $validated = $request->validate([
            'content' => ['required', 'string', 'min:3', 'max:5000'],
        ]);

        $note = LeadNote::create([
            'lead_id' => $lead->id,
            'user_id' => $user->id,
            'content' => $validated['content'],
        ]);

        LeadActivity::create([
            'lead_id' => $lead->id,
            'user_id' => $user->id,
            'action_type' => 'note_added',
            'description' => "Internal note added by {$user->name}.",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Note added successfully.',
            'data' => $note->load('author:id,name,avatar'),
        ], 201);
    }

    public function exportCsv(Request $request): StreamedResponse|JsonResponse
    {
        $user = $request->user();

        if (!$user->hasPermission('leads.export')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: You do not have permission to export leads.',
            ], 403);
        }

        $leads = Lead::with('assignedAgent')
            ->accessibleBy($user)
            ->filter($request->only(['search', 'status', 'priority', 'assigned_to', 'service', 'date_from', 'date_to']))
            ->orderBy('created_at', 'desc')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="slice_leads_' . date('Y-m-d_His') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        AuditLog::log('leads_exported', null, null, ['count' => $leads->count()]);

        return response()->stream(function () use ($leads) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'Reference Code',
                'Client Name',
                'Email',
                'Phone',
                'Company',
                'Requested Service',
                'Budget Range',
                'Status',
                'Priority',
                'Est. Deal Value ($)',
                'Assigned Agent',
                'Source',
                'UTM Source',
                'UTM Campaign',
                'Created At',
            ]);

            foreach ($leads as $lead) {
                fputcsv($handle, [
                    $lead->reference_code,
                    $lead->full_name,
                    $lead->email,
                    $lead->phone,
                    $lead->company,
                    $lead->requested_service,
                    $lead->budget_range,
                    $lead->status,
                    $lead->priority,
                    $lead->estimated_deal_value,
                    $lead->assignedAgent?->name ?? 'Unassigned',
                    $lead->source,
                    $lead->utm_source,
                    $lead->utm_campaign,
                    $lead->created_at->toDateTimeString(),
                ]);
            }
            fclose($handle);
        }, 200, $headers);
    }
}
