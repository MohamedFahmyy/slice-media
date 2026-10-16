<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'reference_code',
        'full_name',
        'email',
        'phone',
        'company',
        'requested_service',
        'budget_range',
        'project_description',
        'preferred_language',
        'status',
        'priority',
        'estimated_deal_value',
        'assigned_to',
        'source',
        'referring_page',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'ip_address',
        'user_agent',
        'won_at',
        'lost_at',
        'lost_reason',
        'last_contacted_at',
    ];

    protected $casts = [
        'estimated_deal_value' => 'decimal:2',
        'won_at' => 'datetime',
        'lost_at' => 'datetime',
        'last_contacted_at' => 'datetime',
    ];

    public function assignedAgent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(LeadNote::class)->latest();
    }

    public function activities(): HasMany
    {
        return $this->hasMany(LeadActivity::class)->latest();
    }

    /**
     * Scope for filtering leads based on user role and ownership
     */
    public function scopeAccessibleBy(Builder $query, User $user): Builder
    {
        // Super Admin, Admin, and Sales Manager can view all leads
        if ($user->hasRole('super-admin') || $user->hasRole('administrator') || $user->hasRole('sales-manager')) {
            return $query;
        }

        // Sales Agent only views leads assigned to them
        if ($user->hasRole('sales-agent')) {
            return $query->where('assigned_to', $user->id);
        }

        // Analyst / Read Only: can view all leads if they have 'leads.view'
        if ($user->hasPermission('leads.view')) {
            return $query;
        }

        return $query->where('assigned_to', $user->id);
    }

    /**
     * Scope for searching and filtering
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('reference_code', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (!empty($filters['assigned_to'])) {
            $query->where('assigned_to', $filters['assigned_to']);
        }

        if (!empty($filters['service'])) {
            $query->where('requested_service', $filters['service']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query;
    }
}
