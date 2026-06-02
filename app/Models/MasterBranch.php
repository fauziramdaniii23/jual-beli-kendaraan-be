<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class MasterBranch extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'branch';

    protected $primaryKey = 'branch_id';

    protected $fillable = [
        'name',
        'address',
        'map_link',
        'phone',
        'is_active',
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
    public function cars(): HasMany
    {
        return $this->hasMany(
            Car::class,
            'branch_id',
            'branch_id'
        );
    }
}
