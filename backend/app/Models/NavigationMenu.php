<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NavigationMenu extends Model
{
    use HasFactory;

    protected $fillable = [
        'location',
        'name',
        'items',
    ];

    protected $casts = [
        'items' => 'array',
    ];
}
