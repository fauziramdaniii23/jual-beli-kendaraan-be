<?php

namespace App\services;

use App\Models\Order;
use App\repositories\OrderRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(protected OrderRepository $orderRepository) {}

    public function getOrders(Request $request)
    {
        return $this->orderRepository->getOrders(
            filters: [
                'status_code' => $request->status_code,
                'type_paid' => $request->type_paid,
            ]
        );
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            Order::create($data);
        });
    }
}
