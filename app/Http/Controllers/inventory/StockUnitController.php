<?php

namespace App\Http\Controllers\inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\StockUnitRequest;
use App\Models\MasterReference;
use App\services\StockUnitService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockUnitController extends Controller
{
    public function __construct(protected StockUnitService $stockUnitService) {}

    private $optionTypes = [
        'brand' => 'BRAND',
        'model' => 'MODEL',
        'transmission' => MasterReference::TYPE_TRANSMISSION,
        'car_type' => MasterReference::TYPE_CAR,
        'fuel_type' => MasterReference::TYPE_FUEL_TYPE,
        'status' => MasterReference::TYPE_STATUS,
        'plate_type' => MasterReference::TYPE_PLATE,
        'seat_type' => MasterReference::TYPE_SEAT,
    ];

    public function index(Request $request)
    {
        $stockUnit = $this->stockUnitService->getUnit($request);

        $options = collect($this->optionTypes)
            ->mapWithKeys(fn ($type, $key) => [
                $key => $this->stockUnitService->getOptionFilter($type),
            ]);

        return Inertia::render('inventory/stock-unit', ['stock_unit' => $stockUnit, 'options' => $options]);
    }

    public function create(Request $request)
    {
        $options = collect($this->optionTypes)
            ->mapWithKeys(fn ($type, $key) => [
                $key => $this->stockUnitService->getOptionFilter($type),
            ]);

        return Inertia::render('inventory/form-stock-unit', ['options' => $options, 'type' => 'create']);
    }

    public function store(StockUnitRequest $request)
    {
        try {
            $this->stockUnitService->store($request->validated());
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Stock Unit berhasil ditambahkan.',
            ]);

            return redirect()->route('inventory.stock-unit');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return back()->withErrors($e->getMessage());
        }
    }

    public function show(Request $request, $id)
    {
        $type = $request->type;
        $stockUnit = $this->stockUnitService->getUnitById($id);
        $options = collect($this->optionTypes)
            ->mapWithKeys(fn ($type, $key) => [
                $key => $this->stockUnitService->getOptionFilter($type),
            ]);

        return Inertia::render('inventory/form-stock-unit', ['stock_unit' => $stockUnit, 'options' => $options, 'type' => $type]);
    }

    public function update(StockUnitRequest $request, $id)
    {
        try {
            $this->stockUnitService->update($id, $request->validated());

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Stock Unit berhasil diperbarui.',
            ]);

            return redirect()->route('inventory.stock-unit');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $this->stockUnitService->deleteUnit($id);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Stock Unit berhasil dihapus.',
            ]);

            return redirect()->route('inventory.stock-unit');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
