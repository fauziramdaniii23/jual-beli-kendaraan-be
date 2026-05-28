<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Reviews extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'reviews';

    protected $primaryKey = 'review_id';

    protected $fillable = [
        'cars_id',
        'user_id',
        'rating',
        'review_text',
        'is_published',
        'image',
    ];

    protected static function booted(): void
    {
        static::creating(function ($review) {
            $review->created_by = Auth::user()?->email;
            $review->updated_by = Auth::user()?->email;
        });

        static::updating(function ($review) {
            $review->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($review) {
            $review->deleted_by = Auth::user()?->email;
            $review->is_active = false;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $review->saveQuietly();
        });
    }

    protected $appends = ['image_name', 'image_src'];

    public function getImageNameAttribute()
    {
        return basename($this->image);
    }

    public function getImageSrcAttribute()
    {
        return asset('storage/'.$this->image);
    }

    public function unit(): BelongsTo
    {
        return $this->BelongsTo(
            Car::class,
            'cars_id',
            'cars_id'
        );
    }

    public function user(): BelongsTo
    {
        return $this->BelongsTo(
            User::class,
            'user_id',
            'id'
        );
    }
}
