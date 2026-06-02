<?php

namespace App\Http\Controllers;

use App\Models\Reviews;
use App\services\BrandService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class TestController extends Controller
{
    use ApiResponse;

    public function __construct(protected BrandService $brandService) {}

    public function test(Request $request)
    {
        $data = Reviews::with([
            'unit:cars_id,name',
            'user:id,name',
        ])->get();

        return $this->successResponse($data);
    }
}
