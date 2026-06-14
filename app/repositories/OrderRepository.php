<?php

namespace App\repositories;

use App\Models\Order;

class OrderRepository
{
    public function getOrders(array $filters)
    {
        return Order::with([
            'customer',
            'unit',
            'status',
            'typePaid',
        ])->get();
    }
}
