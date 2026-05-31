<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\services\BranchService;
use App\services\FAQService;
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
        protected BranchService $branchService,
        protected FAQService $faqService,
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
    public function getBranch(Request $request): JsonResponse
    {
        try {
            $branch = $this->branchService->getBranchsWithPaginate($request);
            return $this->paginateResponse($branch);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
    public function getFaq(Request $request): JsonResponse
    {
        try {
            $faq = $this->faqService->getFaq($request);
            return $this->successResponse($faq);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
