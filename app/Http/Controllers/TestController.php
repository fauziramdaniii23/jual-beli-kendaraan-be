<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Promo;
use App\Models\Reviews;
use App\services\BrandService;
use App\services\PromoService;
use App\services\StockUnitService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class TestController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected BrandService $brandService,
        protected PromoService $promoService,
        protected StockUnitService $stockUnitService,
    ) {}

    public function test(Request $request)
    {
        $data = Car::query()
            ->get()
            ->keyBy('car_id');


        return $this->successResponse($data);
    }
}
