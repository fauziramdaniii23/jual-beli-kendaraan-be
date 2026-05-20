<?php

namespace App\Http\Controllers\inventory;

use App\Http\Controllers\Controller;
use App\Models\MasterReference;
use App\services\StockUnitService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockUnitController extends Controller
{
    public function __construct(protected StockUnitService $stockUnitService) {}

    public function index(Request $request)
    {
        $stockUnit = $this->stockUnitService->getUnit($request);
        $optionTypes = [
            'brand' => 'BRAND',
            'model' => 'MODEL',
            'transmission' => MasterReference::TYPE_TRANSMISSION,
            'car_type' => MasterReference::TYPE_CAR,
            'fuel_type' => MasterReference::TYPE_FUEL_TYPE,
            'status' => MasterReference::TYPE_STATUS,
        ];

        $options = collect($optionTypes)
            ->mapWithKeys(fn ($type, $key) => [
                $key => $this->stockUnitService->getOptionFilter($type),
            ]);

        return Inertia::render('inventory/stock-unit', ['stock_unit' => $stockUnit, 'options' => $options]);
    }

    public function store(Request $request)
    {
        return Inertia::render('inventory/stock-unit', []);
    }

    public function show($id)
    {
        return Inertia::render('inventory/stock-unit', []);
    }

    public function update(Request $request, $id)
    {
        return Inertia::render('inventory/stock-unit', []);
    }

    public function destroy($id)
    {
        return Inertia::render('inventory/stock-unit', []);
    }
}
