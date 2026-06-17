<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\MasterReference;
use App\Models\Order;
use App\Models\TradeIn;
use App\services\StockUnitService;
use App\services\TradeInService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TradeInController extends Controller
{
    public function __construct(
        protected TradeInService $tradeInService,
        protected StockUnitService $stockUnitService,
    ) {}

    public function index(Request $request)
    {
        $tradeIns = $this->tradeInService->getTradeIn($request);
        $status = MasterReference::byType(MasterReference::STATUS_TRADE_IN)->get();

        return Inertia::render('customers/trade-in', ['tradeIns' => $tradeIns, 'status' => $status]);
    }

    public function form(Request $request)
    {
        try {
            $type = $request->input('type');
            $tradeInId = $request->input('trade_in_id');

            $tradeIn = $tradeInId ? TradeIn::with([
                'unit',
                'order',
            ])->findOrFail($tradeInId) : null;

            $orders = Order::query()->with(['unit', 'customer'])->where('type_paid_code', 'TRADE IN')->get();
            $status = MasterReference::byType(MasterReference::STATUS_TRADE_IN)->get();
            $order = null;
            if ($type !== 'create') {
                $order = Order::query()->with(['unit', 'customer'])->where('order_id', $tradeIn->order_id)->first();
            }

            return Inertia::render('customers/form-trade-in', [
                'type' => $type,
                'tradeIn' => $tradeIn,
                'orders' => $orders,
                'status' => $status,
                'order' => $order,
            ]);
        } catch (\Exception $e) {
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
                'car_id' => 'required|exists:cars,car_id',
                'order_id' => 'required|exists:orders,order_id',
                'brand' => 'required|string',
                'model' => 'required|string',
                'variant' => 'required|string',
                'status_code' => 'required|string',
                'year' => 'required|integer',
                'kilometer' => 'required|numeric',
                'inspection_date' => 'required|string',
            ]);
            $this->tradeInService->store($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Data Tukar Tambah berhasil disimpan.',
            ]);

            return redirect()->route('customer.trade-in');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function update(Request $request, TradeIn $tradeIn)
    {
        try {
            $validated = $request->validate([
                'car_id' => 'required|exists:cars,car_id',
                'brand' => 'required|string',
                'model' => 'required|string',
                'model_id' => 'required|exists:model,model_id',
                'variant' => 'required|string',
                'status_code' => 'required|string',
                'year' => 'required|integer',
                'kilometer' => 'required|numeric',
                'inspection_date' => 'required|string',
            ]);
            $tradeIn->update($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Data Tukar Tambah berhasil disimpan.',
            ]);

            return redirect()->route('customer.trade-in');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function destroy(TradeIn $tradeIn)
    {
        try {
            $tradeIn->delete();
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Data Tukar Tambah berhasil dihapus.',
            ]);

            return redirect()->route('customer.orders');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }
}
