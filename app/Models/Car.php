<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Car extends Model
{
    use SoftDeletes;
    protected $table = 'cars';
    protected $primaryKey = 'cars_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;
    protected $fillable = [
        'name',
        'description',
        'brand_id',
        'model_id',
        'type_code',
        'transmission_code',
        'fuel_type_code',
        'plate_code',
        'seat_code',
        'status_code',
        'kilometer',
        'year',
        'engine_cc',
        'color',
        'price',
        'stnk_validity_period',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];
    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
    protected $appends = ['formatted_price'];
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
            $car->is_active = false;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $car->saveQuietly();
        });
    }
    public function brand()
    {
        return $this->belongsTo(
            MasterBrand::class,
            'brand_id',
            'brand_id'
        );
    }
    public function model()
    {
        return $this->belongsTo(
            MasterModel::class,
            'model_id',
            'model_id'
        );
    }
    public function transmission()
    {
        return $this->belongsTo(
            MasterReference::class,
            'transmission_code',
            'ref_code'
        )->where('ref_type', MasterReference::TYPE_TRANSMISSION);
    }
    public function fuelType()
    {
        return $this->belongsTo(
            MasterReference::class,
            'fuel_type_code',
            'ref_code'
        )->where('ref_type', MasterReference::TYPE_FUEL_TYPE);
    }
    public function plate()
    {
        return $this->belongsTo(
            MasterReference::class,
            'plate_code',
            'ref_code'
        )->where('ref_type', MasterReference::TYPE_PLATE);
    }
    public function seat()
    {
        return $this->belongsTo(
            MasterReference::class,
            'seat_code',
            'ref_code'
        )->where('ref_type', MasterReference::TYPE_SEAT);
    }
    public function status()
    {
        return $this->belongsTo(
            MasterReference::class,
            'status_code',
            'ref_code'
        )->where('ref_type', MasterReference::TYPE_STATUS);
    }
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    public function scopeAvailable($query)
    {
        return $query->where('status_code', 'AVAILABLE');
    }
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp '.number_format($this->price, 0, ',', '.');
    }
    public function images()
    {
        return $this->hasMany(
            CarImage::class,
            'car_id',
            'cars_id'
        );
    }
    public function primaryImage()
    {
        return $this->hasOne(
            CarImage::class,
            'car_id',
            'cars_id'
        )->where('is_primary', true);
    }
}
