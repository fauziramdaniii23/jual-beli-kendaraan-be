<?php

namespace App\repositories;

use App\Models\TradeIn;

class TradeInRepository
{
    public function getTradeIn(array $filters = [])
    {
        return TradeIn::with([
            'unit',
            'customer',
            'order',
            'status',
        ])
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
