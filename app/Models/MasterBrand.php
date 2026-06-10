<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class MasterBrand extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'brand';

    protected $primaryKey = 'brand_id';

    protected $fillable = [
        'brand_name',
        'brand_code',
        'is_active',
        'logo_path',
    ];

    protected static function booted(): void
    {
        static::creating(function ($brand) {
            $brand->created_by = Auth::user()?->email;
            $brand->updated_by = Auth::user()?->email;
        });

        static::updating(function ($brand) {
            $brand->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($brand) {
            $brand->deleted_by = Auth::user()?->email;
            $brand->is_active = false;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $brand->saveQuietly();
        });
    }

    protected $appends = ['file_name', 'file_src'];

    public function getFileNameAttribute()
    {
        return basename($this->logo_path);
    }

    public function getFileSrcAttribute()
    {
        return asset('storage/'.$this->logo_path);
    }

    public function cars(): HasMany
    {
        return $this->hasMany(
            Car::class,
            'brand_id',
            'brand_id'
        );
    }

    public function carModels(): HasMany
    {
        return $this->hasMany(
            MasterModel::class,
            'brand_id',
            'brand_id'
        );
    }
}
