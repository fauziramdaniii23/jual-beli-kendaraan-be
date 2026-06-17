<?php

namespace App\repositories;

use App\Models\TradeIn;

class TradeInRepository
{
    public function getTradeIn(array $filters = [])
    {
        return TradeIn::with([
            'unit',
            'brand',
            'model',
            'customer',
            'order',
            'status',
        ])
            ->when(! empty($filters['brand_id']),
                fn ($query) => $query->where('brand_id', $filters['brand_id'])
            )
            ->when(! empty($filters['model_id']),
                fn ($query) => $query->where('model_id', $filters['model_id'])
            )
            ->when(! empty($filters['status_code']),
                fn ($query) => $query->where('status_code', $filters['status_code'])
            )
            ->when(! empty($filters['year']),
                fn ($query) => $query->where('year', $filters['year'])
            )
            ->latest()
            ->get();
    }

}
