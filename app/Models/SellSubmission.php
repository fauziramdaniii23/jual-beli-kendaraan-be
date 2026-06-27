<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class SellSubmission extends Model
{
    use SoftDeletes;

    protected $table = 'sell_submission';

    protected $primaryKey = 'sell_submission_id';

    public $incrementing = true;

    public $timestamps = true;

    protected $fillable = [
        'customer_id',
        'brand',
        'model',
        'variant',
        'status_code',
        'inspection_date',
        'year',
        'kilometer',
        'created_by',
        'updated_by',
        'deleted_by',
        'expectation_price',
        'final_price',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function ($sell) {
            $sell->created_by = Auth::user()?->email;
            $sell->updated_by = Auth::user()?->email;
        });

        static::updating(function ($sell) {
            $sell->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($sell) {
            $sell->deleted_by = Auth::user()?->email;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $sell->saveQuietly();
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
        )->where('ref_type', MasterReference::STATUS_SELL);
    }
}
