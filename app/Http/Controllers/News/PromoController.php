<?php

namespace App\Http\Controllers\News;

use App\Helper\DateHelper;
use App\Http\Controllers\Controller;
use App\Models\MasterReference;
use App\Models\Promo;
use App\services\PromoService;
use App\services\StockUnitService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Mockery\Exception;

class PromoController extends Controller
{
    public function __construct(
        protected PromoService $promoService,
        protected StockUnitService $stockUnitService
    ) {}

    public function index()
    {
        $promos = $this->promoService->getPromos();

        return Inertia::render('news/promo', ['promos' => $promos]);
    }

    public function form(Request $request)
    {
        try {
            $type = $request->input('type');
            $promoId = $request->input('promo_id');

            $promo = null;

            if ($promoId) {
                $promo = Promo::findOrFail($promoId);
                $promo->start_date = DateHelper::dateFormat($promo->start_date);
                $promo->end_date = DateHelper::dateFormat($promo->end_date);
            }

            return Inertia::render('news/form-promo', ['promo' => $promo, 'type' => $type]);
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function addPromoToUnit(Request $request, Promo $promo)
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
            $stockUnit = $this->stockUnitService->getUnit($request);

            $mapPromoStokUnit = $this->promoService->mapPromoStockUnit($promo, $stockUnit);

            $options = collect($optionTypes)
                ->mapWithKeys(fn ($type, $key) => [
                    $key => $this->stockUnitService->getOptionFilter($type),
                ]);

            return Inertia::render('news/add-promo-to-unit', ['promo' => $promo, 'stock_unit' => $mapPromoStokUnit, 'options' => $options]);
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function storePromoToUnit(Request $request, Promo $promo)
    {
        try {
            $test = $request->all();
            $validate = $request->validate([
                'select_all' => 'required|boolean',
                'list_unit' => 'nullable|array',
                'brand_id' => 'nullable|numeric',
                'branch_id' => 'nullable|numeric',
                'model_id' => 'nullable|numeric',
                'car_type' => 'nullable|string',
                'transmission' => 'nullable|string',
                'fuel_type' => 'nullable|string',
                'status' => 'nullable|string',
            ]);
            $filter = [
                'brand_id' => $validate['brand_id'] ?? null,
                'branch_id' => $validate['branch_id'] ?? null,
                'model_id' => $validate['model_id'] ?? null,
                'car_type' => $validate['car_type'] ?? null,
                'transmission' => $validate['transmission'] ?? null,
                'fuel_type' => $validate['fuel_type'] ?? null,
                'status' => $validate['status'] ?? null,
            ];

            $this->promoService->storePromoToUnit($promo, $filter, $validate['select_all'], $validate['list_unit']);

            return redirect()->route('news.promos');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:200',
                'code' => 'required|string|max:50|unique:promos,code',
                'type' => 'required|in:percentage,fixed',
                'discount_value' => 'required|numeric|min:0',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'is_active' => 'nullable|boolean',
                'image_file' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            $this->promoService->store($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Promo berhasil disimpan.',
            ]);

            return redirect()->route('news.promos');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function update(Request $request, Promo $promo)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:200',
                'code' => [
                    'required',
                    'string',
                    'max:50',
                    Rule::unique('promos', 'code')
                        ->ignore($promo->promo_id, 'promo_id'),
                ],
                'type' => 'required|in:percentage,fixed',
                'discount_value' => 'required|numeric|min:0',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'is_active' => 'nullable|boolean',
                'image_file' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ]);
            $this->promoService->update($validated, $promo);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Promo berhasil disimpan.',
            ]);

            return redirect()->route('news.promos');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function destroy(Promo $promo)
    {
        try {
            $this->promoService->delete($promo);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Promo berhasil dihapus.',
            ]);

            return redirect()->route('news.promos');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }
}
