<?php

namespace App\services;

use App\Models\Order;
use App\Models\SalesInvoice;
use App\repositories\CustomerRepository;

class SalesInvoiceService
{
    public function __construct(
        protected CustomerRepository $customerRepository,
        protected StockUnitService $stockUnitService,
    ) {}

    public function getSalesInvoice()
    {
        return SalesInvoice::query()->get();
    }

    public function getOrder()
    {
        $orders = Order::query()
            ->with('customer')
            ->with('unit')
            ->get();

        return $orders->map(function ($order) {
            $order->unit = $this->stockUnitService->mapUnit($order->unit);
            return $order;
        });
    }
}
