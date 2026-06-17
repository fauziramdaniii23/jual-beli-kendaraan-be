<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class TradeIn extends Model
{
    use SoftDeletes;

    protected $table = 'trade_in';

    protected $primaryKey = 'trade_in_id';

    public $incrementing = true;

    public $timestamps = true;

    protected $fillable = [
        'car_id',
        'brand',
        'model',
        'variant',
        'order_id',
        'status_code',
        'inspection_date',
        'year',
        'kilometer',
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

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function status()
    {
        return $this->belongsTo(
            MasterReference::class,
            'status_code',
            'ref_code'
        )->where('ref_type', MasterReference::STATUS_TRADE_IN);
    }
}
