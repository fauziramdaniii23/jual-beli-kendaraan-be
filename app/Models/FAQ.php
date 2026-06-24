<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        static::creating(function ($faq) {
            $faq->created_by = Auth::user()?->email;
            $faq->updated_by = Auth::user()?->email;
        });

        static::updating(function ($faq) {
            $faq->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($faq) {
            $faq->deleted_by = Auth::user()?->email;
            $faq->is_published = false;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $faq->saveQuietly();
        });
    }
    public function category(): BelongsTo
    {
        return $this->BelongsTo(MasterReference::class, 'category_code', 'ref_code');
    }

}
