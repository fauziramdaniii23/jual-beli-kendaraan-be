<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Car extends Model
{
    use SoftDeletes;

    /**
     * Table Name
     */
    protected $table = 'cars';

    /**
     * Primary Key
     */
    protected $primaryKey = 'cars_id';

    /**
     * Auto Increment
     */
    public $incrementing = true;

    /**
     * Primary Key Type
     */
    protected $keyType = 'int';

    /**
     * Timestamps
     */
    public $timestamps = true;

    /**
     * Fillable Columns
     */
    protected $fillable = [
        'name',
        'description',
        'brand_id',
        'model_id',
        'type_code',
        'transmision_code',
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

    /**
     * Cast Attributes
     */
    protected $casts = [
        'kilometer' => 'decimal:2',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'stnk_validity_period' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
    protected $appends = ['formatted_price'];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * MasterBrand Relation
     */
    public function brand()
    {
        return $this->belongsTo(
            MasterBrand::class,
            'brand_id',
            'brand_id'
        );
    }

    /**
     * Model Relation
     */
    public function model()
    {
        return $this->belongsTo(
            MasterModel::class,
            'model_id',
            'model_id'
        );
    }
    /*
   |--------------------------------------------------------------------------
   | Transmission
   |--------------------------------------------------------------------------
   */

    public function transmission()
    {
        return $this->belongsTo(
            MasterReference::class,
            'transmision_code',
            'ref_code'
        )->where('ref_type', 'TRANSMISSION');
    }

    /*
    |--------------------------------------------------------------------------
    | Fuel Type
    |--------------------------------------------------------------------------
    */

    public function fuelType()
    {
        return $this->belongsTo(
            MasterReference::class,
            'fuel_type_code',
            'ref_code'
        )->where('ref_type', 'FUEL_TYPE');
    }

    /*
    |--------------------------------------------------------------------------
    | Plate
    |--------------------------------------------------------------------------
    */

    public function plate()
    {
        return $this->belongsTo(
            MasterReference::class,
            'plate_code',
            'ref_code'
        )->where('ref_type', 'PLATE');
    }

    /*
    |--------------------------------------------------------------------------
    | Seat
    |--------------------------------------------------------------------------
    */

    public function seat()
    {
        return $this->belongsTo(
            MasterReference::class,
            'seat_code',
            'ref_code'
        )->where('ref_type', 'SEAT');
    }

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    public function status()
    {
        return $this->belongsTo(
            MasterReference::class,
            'status_code',
            'ref_code'
        )->where('ref_type', 'CAR_STATUS');
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    /**
     * Active Cars Scope
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Available Cars Scope
     */
    public function scopeAvailable($query)
    {
        return $query->where('status_code', 'AVAILABLE');
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    /**
     * Format Price
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp '.number_format($this->price, 0, ',', '.');
    }
    /**
     * Car Images Relation
     */
    public function images()
    {
        return $this->hasMany(
            CarImage::class,
            'car_id',
            'cars_id'
        );
    }

    /**
     * Primary Image Relation
     */
    public function primaryImage()
    {
        return $this->hasOne(
            CarImage::class,
            'car_id',
            'cars_id'
        )->where('is_primary', true);
    }
}
