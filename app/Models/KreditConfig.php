<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class KreditConfig extends Model
{
    use SoftDeletes;

    protected $table = 'kredit_configs';

    protected $primaryKey = 'kredit_config';

    protected $fillable = [
        'name',
        'min_dp_percent',
        'max_dp_percent',
        'annual_interest_rate',
        'min_tenor_month',
        'max_tenor_month',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected static function booted(): void
    {
        static::creating(function ($config) {
            $config->created_by = Auth::user()?->email;
            $config->updated_by = Auth::user()?->email;
        });

        static::updating(function ($config) {
            $config->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($config) {
            $config->deleted_by = Auth::user()?->email;
            $config->is_published = false;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $config->saveQuietly();
        });
    }
}
