<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMovie extends Model
{
    protected $fillable = [
        'user_id',
        'movie_id',
        'status',
        'rating',
        'review',
        'watched_at',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'decimal:1',
            'watched_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
