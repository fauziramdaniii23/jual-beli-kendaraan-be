<?php

namespace App\repositories;

use App\Models\PreOrder;

class PreOrderRepository
{
    public function getPreOrder(array $filters = [])
    {
        return PreOrder::with([
            'customer',
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
