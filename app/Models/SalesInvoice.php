<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SalesInvoice extends Model
{
    use SoftDeletes;

    protected $table = 'sales_invoices';

    protected $primaryKey = 'sales_invoices_id';

    public $incrementing = true;

    public $timestamps = true;

    protected $fillable = [
        'invoice_date',
        'customer_id',
        'car_id',
        'order_id',
        'final_price',
        'notes',
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
        static::creating(function ($invoice) {
            $invoice->order_uuid = self::generateOrderUuid();
            $invoice->created_by = Auth::user()?->email;
            $invoice->updated_by = Auth::user()?->email;
        });

        static::updating(function ($invoice) {
            $invoice->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($invoice) {
            $invoice->deleted_by = Auth::user()?->email;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $invoice->saveQuietly();
        });
    }

    public static function generateOrderUuid(): string
    {
        do {
            $uuid = 'ORDER-'.strtoupper(Str::random(12));
        } while (
            self::query()->where('order_uuid', $uuid)->exists()
        );

        return $uuid;
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

    public function files()
    {
        return $this->hasMany(SalesInvoiceFile::class, 'sales_invoice_id');
    }
}
