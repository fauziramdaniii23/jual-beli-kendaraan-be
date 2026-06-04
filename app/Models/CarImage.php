<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class CarImage extends Model
{
    use SoftDeletes;

    protected $table = 'car_images';

    protected $primaryKey = 'image_id';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = true;

    protected $fillable = [
        'car_id',
        'path',
        'is_primary',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function ($car) {
            $car->created_by = Auth::user()?->email;
            $car->updated_by = Auth::user()?->email;
        });

        static::updating(function ($car) {
            $car->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($car) {
            $car->deleted_by = Auth::user()?->email;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $car->saveQuietly();
        });
    }

    protected $appends = ['file_name', 'file_src'];

    public function getFileNameAttribute()
    {
        return basename($this->path);
    }

    public function getFileSrcAttribute()
    {
        return asset('storage/'.$this->path);
    }

    public function car()
    {
        return $this->belongsTo(
            Car::class,
            'car_id',
            'car_id'
        );
    }
}
