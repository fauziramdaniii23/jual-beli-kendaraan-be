<?php

namespace App\Http\Controllers;

use App\services\BrandService;
use App\services\PromoService;
use App\services\StockUnitService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        DB::enableQueryLog();
        $data = $this->stockUnitService->getUnit($request);

        $queries = DB::getQueryLog();

        Log::info('Total Queries: '.count($queries));

        return $this->successResponse($data);
    }
}
