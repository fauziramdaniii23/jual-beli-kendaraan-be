<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Customer;
use App\Models\MasterBranch;
use App\Models\MasterReference;
use App\Models\TestDrive;
use App\services\TestDriveService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestDriveController extends Controller
{
    public function __construct(protected TestDriveService $testDriveService) {}

    public function index(Request $request)
    {
        $testDrives = $this->testDriveService->getTestDrive($request);
        $status = MasterReference::byType(MasterReference::STATUS_TEST_DRIVE)->get();
        $branch = MasterBranch::select(['branch_id', 'name'])->get();

        return Inertia::render('customers/test-drive', ['testDrives' => $testDrives, 'status' => $status, 'branch' => $branch]);
    }

    public function form(Request $request)
    {
        try {
            $type = $request->input('type');
            $testDriveId = $request->input('test_drive_id');

            $testDrive = $testDriveId ? TestDrive::with([
                'customer',
                'unit',
                'status',
                'branch',
            ])->findOrFail($testDriveId) : null;

            $customers = $type !== 'detail' ? Customer::query()->select(['customer_id', 'name', 'email', 'phone'])->get() : null;
            $units = $type !== 'detail' ? Car::query()->with('status:ref_code,ref_value')->select(['car_id', 'name', 'status_code'])->get() : null;
            $status = MasterReference::byType(MasterReference::STATUS_TEST_DRIVE)->get();
            $cabang = MasterBranch::query()->select(['branch_id', 'name'])->get();

            return Inertia::render('customers/form-test-drive', [
                'type' => $type,
                'testDrive' => $testDrive,
                'customers' => $customers,
                'units' => $units,
                'status' => $status,
                'branch' => $cabang,
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
                'branch_id' => 'required|exists:branch,branch_id',
                'date' => 'required|string',
                'time' => 'required|string',
                'status_code' => 'required|string',
            ]);
            $validated['test_drive_date'] = Carbon::parse(
                "{$validated['date']} {$validated['time']}"
            );

            $this->testDriveService->store($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Test Drive berhasil disimpan.',
            ]);

            return redirect()->route('customer.test-drive');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function update(Request $request, TestDrive $testDrive)
    {
        try {
            $validated = $request->validate([
                'type_paid_code' => 'required|string',
                'status_code' => 'required|string',
            ]);
            $testDrive->update($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Test Drive berhasil disimpan.',
            ]);

            return redirect()->route('customer.test-drive');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function destroy(TestDrive $testDrive)
    {
        try {
            $testDrive->delete();
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Test Drive berhasil dihapus.',
            ]);

            return redirect()->route('customer.test-drive');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }
}
