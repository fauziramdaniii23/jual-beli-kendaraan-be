<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use App\Notifications\CarPublishedNotification;
use App\services\BrandService;
use App\services\NotificationService;
use App\services\OrderService;
use App\services\PromoService;
use App\services\StockUnitService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class TestController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected OrderService $orderService,
        protected BrandService $brandService,
        protected PromoService $promoService,
        protected StockUnitService $stockUnitService,
        protected NotificationService $notificationService,
    ) {}

    public function test(Request $request)
    {
        $users = User::permission('notification')->get();
        return $this->successResponse($users);
    }

    public function testGetNotification(Request $request)
    {
        $user = User::findOrFail(1);

        return $this->successResponse([
            'all' => $user->notifications,
            'unread' => $user->unreadNotifications,
            'read' => $user->readNotifications,
        ]);
    }

    public function testNotification()
    {
        $order = Order::findOrFail(1);
        $unit = Car::findOrFail(1);
        $customer = Customer::findOrFail(1);
        $this->notificationService->sendNotificationOrder($order, $unit, $customer);

        return $this->successResponse('success');
    }
}
