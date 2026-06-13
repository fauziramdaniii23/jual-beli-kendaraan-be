<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\MasterReference;
use App\services\BranchService;
use App\services\FAQService;
use App\services\PromoService;
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
        protected PromoService $promoService,
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

    public function detailUnit(Request $request, Car $car): JsonResponse
    {
        try {
            $car->load([
                'promos',
                'brand:brand_id,brand_name,logo_path',
                'model:model_id,model_name',
                'transmission:ref_code,ref_value',
                'fuelType:ref_code,ref_value',
                'plate:ref_code,ref_value',
                'seat:ref_code,ref_value',
                'type:ref_code,ref_value',
                'status:ref_code,ref_value',
                'images:image_id,car_id,path,is_primary',
            ]);

            $unit = $this->stockUnitService->mapUnit($car);
            $recomendation = $this->stockUnitService->getRecommendationCars($car);
            $recomendation->map(function ($unit) {
                $this->stockUnitService->mapUnit($unit);
            });
            $data = [
                'unit' => $unit,
                'recomendation' => $recomendation,
            ];

            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function orderUnit(Request $request, Car $car): JsonResponse
    {
        try {
            $test = $request->all();
            return $this->successResponse($car);

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

    public function getPromo(Request $request): JsonResponse
    {
        try {
            $promos = $this->promoService->getPromosApi();

            return $this->successResponse($promos);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getAllPromoWithUnit(Request $request): JsonResponse
    {
        try {
            $promos = $this->promoService->getPromosApiMainPage();

            return $this->successResponse($promos);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getOptionFilters(Request $request): JsonResponse
    {
        try {
            $optionTypes = [
                'brand' => 'BRAND',
                'branch' => 'BRANCH',
                'model' => 'MODEL',
                'transmission' => MasterReference::TYPE_TRANSMISSION,
                'car_type' => MasterReference::TYPE_CAR,
                'fuel_type' => MasterReference::TYPE_FUEL_TYPE,
                'status' => MasterReference::TYPE_STATUS,
                'plate_type' => MasterReference::TYPE_PLATE,
                'seat_type' => MasterReference::TYPE_SEAT,
            ];
            $options = collect($optionTypes)
                ->mapWithKeys(fn ($type, $key) => [
                    $key => $this->stockUnitService->getOptionFilter($type),
                ]);

            return $this->successResponse($options);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
