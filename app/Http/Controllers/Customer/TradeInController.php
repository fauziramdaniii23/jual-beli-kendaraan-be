<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\MasterBrand;
use App\Models\MasterModel;
use App\Models\MasterReference;
use App\Models\Order;
use App\Models\TradeIn;
use App\repositories\BrandRepository;
use App\repositories\CarModelRepository;
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
                'customer',
                'unit',
            ])->findOrFail($tradeInId) : null;

            $orders = $type !== 'detail' ? Order::query()->with(['unit', 'customer'])->get() : null;
            $status = MasterReference::byType(MasterReference::STATUS_TRADE_IN)->get();
            $brands = $this->stockUnitService->getOptionFilter('BRAND');
            $models = $this->stockUnitService->getOptionFilter('MODEL');

            return Inertia::render('customers/form-trade-in', [
                'type' => $type,
                'tradeIn' => $tradeIn,
                'orders' => $orders,
                'brands' => $brands,
                'models' => $models,
                'status' => $status,
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
                'customer_id' => 'required|exists:customers,customer_id',
                'car_id' => 'required|exists:cars,car_id',
                'type_paid_code' => 'required|string',
                'status_code' => 'required|string',
            ]);
            $this->orderService->storeOrder($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Order berhasil disimpan.',
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

    public function update(Request $request, Order $order)
    {
        try {
            $validated = $request->validate([
                'type_paid_code' => 'required|string',
                'status_code' => 'required|string',
            ]);
            $order->update($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Order berhasil disimpan.',
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

    public function destroy(Order $order)
    {
        try {
            $order->delete();
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Order berhasil dihapus.',
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
