<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class TestDrive extends Model
{
    use SoftDeletes;

    protected $table = 'test_drives';

    protected $primaryKey = 'test_drive_id';

    public $incrementing = true;

    public $timestamps = true;

    protected $fillable = [
        'car_id',
        'customer_id',
        'branch_id',
        'status_code',
        'test_drive_date',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'test_drive_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function ($drive) {
            $drive->created_by = Auth::user()?->email;
            $drive->updated_by = Auth::user()?->email;
        });

        static::updating(function ($drive) {
            $drive->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($drive) {
            $drive->deleted_by = Auth::user()?->email;
            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $drive->saveQuietly();
        });
    }

    protected $appends = [
        'date',
        'time',
    ];

    protected function date(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->test_drive_date?->format('Y-m-d')
        );
    }

    protected function time(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->test_drive_date?->format('H:i')
        );
    }

    public function unit()
    {
        return $this->belongsTo(Car::class, 'car_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
    public function branch()
    {
        return $this->belongsTo(MasterBranch::class, 'branch_id');
    }

    public function status()
    {
        return $this->belongsTo(
            MasterReference::class,
            'status_code',
            'ref_code'
        )->where('ref_type', MasterReference::STATUS_TEST_DRIVE);
    }
}
