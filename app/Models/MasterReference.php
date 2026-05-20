<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class MasterReference extends Model
{
    const TYPE_TRANSMISSION = 'TRANSMISSION';
    const TYPE_CAR = 'CAR_TYPE';
    const TYPE_FUEL_TYPE = 'FUEL_TYPE';
    const TYPE_PLATE = 'PLATE_TYPE';
    const TYPE_SEAT = 'SEAT_TYPE';
    const TYPE_STATUS = 'CAR_STATUS';

    use HasFactory;
    protected $table = 'mst_reference';

    protected $primaryKey = 'ref_id';

    protected $fillable = [
        'ref_type',
        'ref_code',
        'ref_value',
        'is_active',
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
    public function scopeByType($query, string $type)
    {
        return $query->where('ref_type', $type);
    }
}
