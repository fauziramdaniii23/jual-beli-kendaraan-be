<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Promo extends Model
{
    const TYPE_PERCENT = 'percentage';

    const TYPE_FIXED = 'fixed';

    protected $table = 'promos';

    protected $primaryKey = 'promo_id';

    protected $fillable = [
        'name',
        'code',
        'type',
        'discount_value',
        'description',
        'start_date',
        'end_date',
        'is_active',
        'image',
    ];

    protected $appends = ['image_name', 'image_src'];

    public function getImageNameAttribute()
    {
        return basename($this->image);
    }

    public function getImageSrcAttribute()
    {
        return asset('storage/'.$this->image);
    }

    public static function calculateFinalPrice(float $price, string $type, float $discountValue): float
    {
        $discount = match ($type) {
            self::TYPE_PERCENT => ($price * $discountValue) / 100,
            self::TYPE_FIXED => $discountValue,
            default => 0,
        };

        return max(0, $price - $discount);
    }

    /** Semua mobil yang mendapat promo ini */
    public function cars(): BelongsToMany
    {
        return $this->belongsToMany(
            Car::class,
            'car_promos',
            'promo_id',
            'car_id',
            'promo_id',
            'cars_id'
        )->withPivot('applied_at')->withTimestamps();
    }

    /** Scope: promo yang sedang aktif dan belum kadaluarsa */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }
}
