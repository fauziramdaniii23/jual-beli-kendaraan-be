<?php

namespace App\Http\Controllers\Api;

use App\Helper\DateHelper;
use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\MasterReference;
use App\services\BranchService;
use App\services\CustomerService;
use App\services\FAQService;
use App\services\OrderService;
use App\services\PromoService;
use App\services\ReviewService;
use App\services\StockUnitService;
use App\services\TestDriveService;
use App\services\TradeInService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApiController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected StockUnitService $stockUnitService,
        protected ReviewService $reviewService,
        protected CustomerService $customerService,
        protected OrderService $orderService,
        protected TestDriveService $testDriveService,
        protected TradeInService $tradeInService,
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
            $rules = [
                'name' => 'required|string',
                'email' => 'required|email',
                'phone' => 'required|string',
                'address' => 'nullable|string',
                'isTestDrive' => 'required|boolean',
                'date' => 'nullable|string',
                'time' => 'nullable|string',
            ];

            if ($request->type === 'tradein') {
                $rules = array_merge($rules, [
                    'brand' => 'required|string',
                    'model' => 'required|string',
                    'variant' => 'required|string',
                    'year' => 'required|integer',
                    'kilometer' => 'required|numeric',
                ]);
            }
            $validated = $request->validate($rules);
            DB::transaction(function () use ($validated, $request, $car) {

                $customer = $this->customerService->updateOrCreate($validated);

                $order = $this->orderService->storeOrder([
                    'customer_id' => $customer->customer_id,
                    'car_id' => $car->car_id,
                ]);

                if ($request->type === 'tradein') {
                    $this->tradeInService->store([
                        'car_id' => $car->car_id,
                        'order_id' => $order->id,
                        'brand_id' => $validated['brand'],
                        'model_id' => $validated['model'],
                        'variant' => $validated['variant'],
                        'year' => $validated['year'],
                        'kilometer' => $validated['kilometer'],
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
            });

            return $this->successResponse($validated);

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
