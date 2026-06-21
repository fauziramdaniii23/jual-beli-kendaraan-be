<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\CarPublishedNotification;
use App\services\BrandService;
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
    ) {}

    public function test(Request $request)
    {
        return $this->successResponse('test');
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
        $user = User::findOrFail(1);
        $user->notify(
            new CarPublishedNotification(
                3,
                'test send email'
            )
        );

        return $this->successResponse($user->notifications);
    }
}
