<?php

namespace App\Http\Controllers;

use App\Models\Reviews;
use App\services\BrandService;
use App\services\StockUnitService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class TestController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected BrandService $brandService,
        protected StockUnitService $stockUnitService,
    ) {}

    public function test(Request $request)
    {
        $data = $this->stockUnitService->getUnit($request);

        return $this->successResponse($data);
    }
}
