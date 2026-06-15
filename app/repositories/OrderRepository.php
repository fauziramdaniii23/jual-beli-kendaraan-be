<?php

namespace App\repositories;

use App\Models\Order;

class OrderRepository
{
    public function getOrders(array $filters = [])
    {
        return Order::with([
            'customer',
            'unit',
            'status',
            'typePaid',
        ])
            ->when(! empty($filters['status_code']),
                fn ($query) => $query->where('status_code', $filters['status_code'])
            )
            ->when(! empty($filters['type_paid']),
                fn ($query) => $query->where('type_paid_code', $filters['type_paid'])
            )
            ->latest()
            ->get();
    }
}
