<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class SalesInvoiceFile extends Model
{
    use SoftDeletes;

    protected $table = 'sales_invoice_files';

    protected $primaryKey = 'sales_invoice_file_id';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = true;

    protected $fillable = [
        'sales_invoice_id',
        'file_name',
        'file_path',
        'file_type',
        'is_primary',
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
        static::creating(function ($file) {
            $file->created_by = Auth::user()?->email;
            $file->updated_by = Auth::user()?->email;
        });

        static::updating(function ($file) {
            $file->updated_by = Auth::user()?->email;
        });

        static::deleting(function ($file) {
            $file->deleted_by = Auth::user()?->email;

            /**
             * supaya deleted_by tersimpan
             * sebelum soft delete dijalankan
             */
            $file->saveQuietly();
        });
    }

    protected $appends = ['file_name', 'file_src'];

    public function getFileNameAttribute()
    {
        return basename($this->file_path);
    }

    public function getFileSrcAttribute()
    {
        return asset('storage/'.$this->file_path);
    }

    public function salesInvoice()
    {
        return $this->belongsTo(SalesInvoice::class, 'sales_invoice_id');
    }
}
