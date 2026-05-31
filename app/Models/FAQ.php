<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class FAQ extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'faqs';

    protected $primaryKey = 'faq_id';

    protected $fillable = [
        'question',
        'answer',
        'category_code',
        'sort_order',
        'is_published',
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
}
