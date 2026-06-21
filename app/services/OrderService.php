<?php

namespace App\services;

use App\Helper\DateHelper;
use App\Models\Car;
use App\Models\Order;
use App\repositories\OrderRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        protected OrderRepository $orderRepository,
        protected CustomerService $customerService,
        protected TestDriveService $testDriveService,
        protected TradeInService $tradeInService,
        protected NotificationService $notificationService,
    ) {}

    public function getOrders(Request $request)
    {
        return $this->orderRepository->getOrders(
            filters: [
                'status_code' => $request->status_code,
                'type_paid' => $request->type_paid,
            ]
        );
    }

    public function storeOrder(array $data)
    {
        return DB::transaction(function () use ($data) {
            return Order::create($data);
        });
    }
    public function doOrder(array $validated, string $type, Car $car): void
    {
        DB::transaction(function () use ($validated, $type, $car) {

            $customer = $this->customerService->updateOrCreate($validated);

            $order = $this->storeOrder([
                'customer_id' => $customer->customer_id,
                'car_id' => $car->car_id,
            ]);

            if ($type === 'tradein') {
                $this->tradeInService->store([
                    'car_id' => $car->car_id,
                    'order_id' => $order->order_id,
                    'brand' => $validated['brand'],
                    'model' => $validated['model'],
                    'variant' => $validated['variant'],
                    'year' => $validated['year'],
                    'kilometer' => $validated['kilometer'],
                ]);
                $order->update([
                    'type_paid_code' => 'TRADE IN',
                ]);
            }

            if ($validated['isTestDrive']) {
                $this->testDriveService->store([
                    'customer_id' => $customer->customer_id,
                    'car_id' => $car->car_id,
                    'branch_id' => $car->branch_id,
                    'test_drive_date' => DateHelper::combine(
                        $validated['date'],
                        $validated['time']
                    ),
                ]);
            }
            $this->notificationService->sendNotificationOrder($order, $car, $customer);
        });
    }
}
