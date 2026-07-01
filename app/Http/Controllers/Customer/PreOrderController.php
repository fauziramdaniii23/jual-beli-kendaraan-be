<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\MasterReference;
use App\Models\PreOrder;
use App\Models\SellSubmission;
use App\repositories\PreOrderRepository;
use App\services\PreOrderService;
use App\services\SellSubmissionService;
use App\services\StockUnitService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PreOrderController extends Controller
{
    public function __construct(
        protected PreOrderService $preOrderService,
        protected StockUnitService $stockUnitService,
    ) {}

    public function index(Request $request)
    {
        $preOrders = $this->preOrderService->getPreOrder($request);
        $status = MasterReference::byType(MasterReference::STATUS_PO)->get();

        return Inertia::render('customers/pre-order', ['preOrders' => $preOrders, 'status' => $status]);
    }

    public function form(Request $request)
    {
        try {
            $type = $request->input('type');
            $poId = $request->input('pre_order_id');

            $po = $poId ? PreOrder::with([
                'customer',
                'status',
            ])->findOrFail($poId) : null;

            $customers = Customer::query()->select(['customer_id', 'name', 'email', 'phone'])->get();
            $status = MasterReference::byType(MasterReference::STATUS_PO)->get();

            return Inertia::render('customers/form-pre-order', [
                'type' => $type,
                'po' => $po,
                'customers' => $customers,
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
                'brand' => 'required|string',
                'model' => 'required|string',
                'variant' => 'required|string',
                'status_code' => 'required|string',
                'year' => 'required|integer',
                'kilometer' => 'required|numeric',
                'expectation_price' => 'required|numeric',
            ]);
            $this->preOrderService->store($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Data Pengajuan Jual Unit berhasil disimpan.',
            ]);

            return redirect()->route('customer.pre-order');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function update(Request $request, PreOrder $preOrder)
    {
        try {
            $validated = $request->validate([
                'customer_id' => 'required|exists:customers,customer_id',
                'brand' => 'required|string',
                'model' => 'required|string',
                'variant' => 'required|string',
                'status_code' => 'required|string',
                'year' => 'required|integer',
                'kilometer' => 'required|numeric',
                'expectation_price' => 'required|numeric',
            ]);
            $preOrder->update($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Data Pengajuan Jual Unit berhasil disimpan.',
            ]);

            return redirect()->route('customer.pre-order');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function destroy(PreOrder $preOrder)
    {
        try {
            $preOrder->delete();
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Data Pengajuan Jual Unit berhasil dihapus.',
            ]);

            return redirect()->route('customer.pre-order');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }
}
