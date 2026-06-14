<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Customer;
use App\Models\MasterReference;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::all();

        return Inertia::render('customers/order', ['orders' => $orders]);
    }

    public function store(Request $request) {}

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
                'status' => $status
            ]);
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }

    }

    public function update(Request $request, Order $order) {}

    public function destroy(Order $order) {}
}
