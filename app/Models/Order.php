<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Order extends Model
{
    use SoftDeletes;

    protected $table = 'orders';

    protected $primaryKey = 'order_id';

    public $incrementing = true;

    public $timestamps = true;

    protected $fillable = [
        'order_uuid',
        'car_id',
        'customer_id',
        'status_code',
        'type_paid',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function ($order) {
            $order->created_by = Auth::user()?->email;
            $order->updated_by = Auth::user()?->email;
        });

        static::updating(function ($order) {
            $order->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($order) {
            $order->deleted_by = Auth::user()?->email;
            $order->is_active = false;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $order->saveQuietly();
        });
    }

    public function unit()
    {
        return $this->belongsTo(Car::class, 'car_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function status()
    {
        return $this->belongsTo(
            MasterReference::class,
            'status_code',
            'ref_code'
        )->where('ref_type', MasterReference::STATUS_ORDER);
    }

    public function typePaid()
    {
        return $this->belongsTo(
            MasterReference::class,
            'type_paid',
            'ref_code'
        )->where('ref_type', MasterReference::TYPE_PAID_ORDER);
    }
}
