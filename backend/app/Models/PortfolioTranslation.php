<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioTranslation extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_project_id',
        'locale',
        'title',
        'summary',
        'challenge',
        'strategy',
        'execution',
        'outcomes',
    ];

    public function portfolioProject(): BelongsTo
    {
        return $this->belongsTo(PortfolioProject::class);
    }
}
