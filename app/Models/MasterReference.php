<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class MasterReference extends Model
{
    const TYPE_TRANSMISSION = 'TRANSMISSION';

    const TYPE_CAR = 'CAR_TYPE';

    const TYPE_FUEL_TYPE = 'FUEL_TYPE';

    const TYPE_PLATE = 'PLATE_TYPE';

    const TYPE_SEAT = 'SEAT_TYPE';

    const TYPE_STATUS = 'CAR_STATUS';

    const STATUS_ORDER = 'STATUS_ORDER';

    const TYPE_PAID_ORDER = 'TYPE_PAID_ORDER';
    const STATUS_TEST_DRIVE = 'STATUS_TEST_DRIVE';

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
        static::creating(function ($reference) {
            $reference->created_by = Auth::user()?->email;
            $reference->updated_by = Auth::user()?->email;
        });

        static::updating(function ($reference) {
            $reference->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($reference) {
            $reference->deleted_by = Auth::user()?->email;
            $reference->is_active = false;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $reference->saveQuietly();
        });
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('ref_type', $type)->where('is_active', true);
    }
}
