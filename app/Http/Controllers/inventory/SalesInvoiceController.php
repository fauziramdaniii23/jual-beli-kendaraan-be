<?php

namespace App\Http\Controllers\inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\StockUnitRequest;
use App\Models\MasterReference;
use App\Models\Promo;
use App\services\SalesInvoiceService;
use App\services\StockUnitService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesInvoiceController extends Controller
{
    public function __construct(
        protected SalesInvoiceService $salesInvoiceService,
        protected StockUnitService $stockUnitService
    ) {}

    public function index(Request $request)
    {
        $salesInvoice = $this->salesInvoiceService->getSalesInvoice();

        return Inertia::render('inventory/sales-invoice', ['sales_invoice' => $salesInvoice]);
    }

    public function create(Request $request)
    {
        $orders = $this->salesInvoiceService->getOrder();

        return Inertia::render('inventory/form-sales-invoice',
            [
                'type' => 'create',
                'orders' => $orders,
            ]);
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
        $promos = Promo::query()->select(['promo_id', 'name', 'code'])->get();

        return Inertia::render('inventory/form-stock-unit', ['stock_unit' => $stockUnit, 'options' => $options, 'type' => $type, 'promos' => $promos]);
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

    public function warranty(Request $request)
    {
        $stockUnit = $this->stockUnitService->getUnit($request);

        $options = collect($this->optionTypes)
            ->mapWithKeys(fn ($type, $key) => [
                $key => $this->stockUnitService->getOptionFilter($type),
            ]);

        return Inertia::render('inventory/stock-unit', ['stock_unit' => $stockUnit, 'options' => $options]);
    }
}
