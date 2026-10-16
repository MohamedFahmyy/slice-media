<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'icon',
        'featured_image',
        'order',
        'is_visible',
        'deliverables',
        'process',
        'duration_en',
        'duration_ar',
        'cta_label_en',
        'cta_label_ar',
        'cta_link',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'order' => 'integer',
        'deliverables' => 'array',
        'process' => 'array',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(ServiceTranslation::class);
    }

    public function translation(string $locale = 'en'): HasOne
    {
        return $this->hasOne(ServiceTranslation::class)->where('locale', $locale);
    }

    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true)->orderBy('order');
    }
}
