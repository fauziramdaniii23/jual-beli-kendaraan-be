<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Customer extends Model
{
    use SoftDeletes;

    protected $table = 'customers';

    protected $primaryKey = 'customer_id';

    public $incrementing = true;

    public $timestamps = true;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'address',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected static function booted(): void
    {
        static::creating(function ($customer) {
            $customer->created_by = Auth::user()?->email;
            $customer->updated_by = Auth::user()?->email;
        });

        static::updating(function ($customer) {
            $customer->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($customer) {
            $customer->deleted_by = Auth::user()?->email;
            $customer->is_active = false;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $customer->saveQuietly();
        });
    }
}
