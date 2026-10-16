<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_id',
        'section_type',
        'order',
        'is_enabled',
        'layout_variant',
        'content',
        'background_settings',
    ];

    protected $casts = [
        'order' => 'integer',
        'is_enabled' => 'boolean',
        'content' => 'array',
        'background_settings' => 'array',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}
