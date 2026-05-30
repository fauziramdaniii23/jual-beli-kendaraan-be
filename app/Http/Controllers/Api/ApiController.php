<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\services\ReviewService;
use App\services\StockUnitService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected StockUnitService $stockUnitService,
        protected ReviewService $reviewService,
    ) {}

    public function getStockUnit(Request $request): JsonResponse
    {
        try {
            $stockUnit = $this->stockUnitService->getUnitWithPagination($request);

            return $this->paginateResponse($stockUnit);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
    public function getReviews(Request $request): JsonResponse
    {
        try {
            $reviews = $this->reviewService->getReviewsWithPaginate($request);
            return $this->paginateResponse($reviews);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
