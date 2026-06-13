<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\services\CustomerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function __construct(protected CustomerService $customerService) {}

    public function index(Request $request)
    {
        $customers = $this->customerService->getCustomer($request);

        return Inertia::render('customers/customer', ['customers' => $customers]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'phone' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'max:255'],
                'address' => ['required', 'string', 'max:255'],
            ]);

            $this->customerService->store($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Model berhasil ditambahkan.',
            ]);

            return redirect()->route('customer');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return back()->withErrors($e->getMessage());
        }
    }

    public function update(Request $request, Customer $customer)
    {
        try {
            $request->merge(['is_active' => filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN)]);
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'phone' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'max:255'],
                'address' => ['required', 'string', 'max:255'],
                'is_active' => ['sometimes', 'boolean'],
            ]);

            $customer->update($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Model berhasil diupdate.',
            ]);

            return redirect()->route('customer');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return back()->withErrors($e->getMessage());
        }
    }

    public function destroy(Request $request, Customer $customer)
    {
        try {
            $customer->delete();

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Model berhasil dihapus.',
            ]);

            return redirect()->route('customer');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return back()->withErrors($e->getMessage());
        }
    }
}
