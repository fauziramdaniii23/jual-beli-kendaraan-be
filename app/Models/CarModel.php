<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarModel extends Model
{
    protected $table = 'model';

    protected $primaryKey = 'model_id';

    protected $fillable = [
        'name',
    ];

    public function cars()
    {
        return $this->hasMany(
            Car::class,
            'model_id',
            'model_id'
        );
    }
}
