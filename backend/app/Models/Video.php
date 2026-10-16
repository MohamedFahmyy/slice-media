<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider',
        'provider_id',
        'external_url',
        'video_path',
        'thumbnail_path',
        'aspect_ratio',
        'duration',
        'category',
        'format_type',
        'order',
        'is_featured',
        'is_published',
    ];

    protected $casts = [
        'order' => 'integer',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(VideoTranslation::class);
    }

    public function translation(string $locale = 'en'): HasOne
    {
        return $this->hasOne(VideoTranslation::class)->where('locale', $locale);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)->orderBy('order');
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }
}
