<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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


    public function car()
    {
        return $this->belongsTo(
            Car::class,
            'car_id',
            'cars_id'
        );
    }
}
