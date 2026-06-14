<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Customer;
use App\Models\MasterReference;
use App\Models\Order;
use App\services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService) {}

    public function index(Request $request)
    {
        $orders = $this->orderService->getOrders($request);
        $status = MasterReference::byType(MasterReference::STATUS_ORDER)->get();
        $typePaid = MasterReference::byType(MasterReference::TYPE_PAID_ORDER)->get();

        return Inertia::render('customers/order', ['orders' => $orders, 'status' => $status, 'typePaid' => $typePaid]);
    }

    public function form(Request $request)
    {
        try {
            $type = $request->input('type');
            $orderId = $request->input('order_id');

            $order = $orderId ? Order::with([
                'customer',
                'unit',
                'status',
                'typePaid',
            ])->findOrFail($orderId) : null;

            $customers = $type !== 'detail' ? Customer::query()->select(['customer_id', 'name', 'email', 'phone'])->get() : null;
            $units = $type !== 'detail' ? Car::query()->with('status:ref_code,ref_value')->select(['car_id', 'name', 'status_code'])->get() : null;
            $typePaid = $type !== 'detail' ? MasterReference::byType(MasterReference::TYPE_PAID_ORDER)->get() : null;
            $status = $type !== 'detail' ? MasterReference::byType(MasterReference::STATUS_ORDER)->get() : null;

            return Inertia::render('customers/form-order', [
                'type' => $type,
                'order' => $order,
                'customers' => $customers,
                'units' => $units,
                'typePaid' => $typePaid,
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
            $this->orderService->store($validated);

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
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }
}
