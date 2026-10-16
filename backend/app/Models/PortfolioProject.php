<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PortfolioProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'client_name',
        'industry',
        'order',
        'is_featured',
        'is_published',
        'published_at',
        'featured_image',
        'gallery',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'order' => 'integer',
        'gallery' => 'array',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(PortfolioTranslation::class);
    }

    public function translation(string $locale = 'en'): HasOne
    {
        return $this->hasOne(PortfolioTranslation::class)->where('locale', $locale);
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
