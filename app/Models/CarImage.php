<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarImage extends Model
{
    use SoftDeletes;

    /**
     * Table Name
     */
    protected $table = 'car_images';

    /**
     * Primary Key
     */
    protected $primaryKey = 'image_id';

    /**
     * Auto Increment
     */
    public $incrementing = true;

    /**
     * Key Type
     */
    protected $keyType = 'int';

    /**
     * Timestamps
     */
    public $timestamps = true;

    /**
     * Fillable
     */
    protected $fillable = [
        'car_id',
        'image_url',
        'is_primary',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'is_primary' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Car Relation
     */
    public function car()
    {
        return $this->belongsTo(
            Car::class,
            'car_id',
            'cars_id'
        );
    }
}
