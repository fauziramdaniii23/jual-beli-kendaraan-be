<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class PreOrder extends Model
{
    use SoftDeletes;

    protected $table = 'pre_order';

    protected $primaryKey = 'pre_order_id';

    public $incrementing = true;

    public $timestamps = true;

    protected $fillable = [
        'customer_id',
        'brand',
        'model',
        'variant',
        'status_code',
        'year',
        'kilometer',
        'created_by',
        'updated_by',
        'deleted_by',
        'expectation_price',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function ($po) {
            $po->created_by = Auth::user()?->email;
            $po->updated_by = Auth::user()?->email;
        });

        static::updating(function ($po) {
            $po->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($po) {
            $po->deleted_by = Auth::user()?->email;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $po->saveQuietly();
        });
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
        )->where('ref_type', MasterReference::STATUS_PO);
    }
}
