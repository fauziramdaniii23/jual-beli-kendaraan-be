<?php

namespace App\Http\Controllers\inventory;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\MasterReference;
use App\Models\SellSubmission;
use App\Models\TradeIn;
use App\services\SellSubmissionService;
use App\services\StockUnitService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellSubmissionController extends Controller
{
    public function __construct(
        protected SellSubmissionService $sellSubmissionService,
        protected StockUnitService $stockUnitService,
    ) {}

    public function index(Request $request)
    {
        $sellSubmisions = $this->sellSubmissionService->getSellSubmission($request);
        $status = MasterReference::byType(MasterReference::STATUS_SELL)->get();

        return Inertia::render('inventory/sell-submission', ['sellSubmisions' => $sellSubmisions, 'status' => $status]);
    }

    public function form(Request $request)
    {
        try {
            $type = $request->input('type');
            $submissionId = $request->input('sell_submission_id');

            $submission = $submissionId ? SellSubmission::with([
                'customer',
                'status',
            ])->findOrFail($submissionId) : null;

            $customers = Customer::query()->select(['customer_id', 'name', 'email', 'phone'])->get();
            $status = MasterReference::byType(MasterReference::STATUS_SELL)->get();

            return Inertia::render('inventory/form-sell-submission', [
                'type' => $type,
                'submission' => $submission,
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
                'inspection_date' => 'required|string',
                'expectation_price' => 'required|numeric',
                'final_price' => 'nullable|numeric',
            ]);
            $this->sellSubmissionService->store($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Data Pengajuan Jual Unit berhasil disimpan.',
            ]);

            return redirect()->route('inventory.sell-submission');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function update(Request $request, SellSubmission $sellSubmission)
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
                'inspection_date' => 'required|string',
                'expectation_price' => 'required|numeric',
                'final_price' => 'nullable|numeric',
            ]);
            $sellSubmission->update($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Data Pengajuan Jual Unit berhasil disimpan.',
            ]);

            return redirect()->route('inventory.sell-submission');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function destroy(SellSubmission $sellSubmission)
    {
        try {
            $sellSubmission->delete();
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Data Pengajuan Jual Unit berhasil dihapus.',
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
