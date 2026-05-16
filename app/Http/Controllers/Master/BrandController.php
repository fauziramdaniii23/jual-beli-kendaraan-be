<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\services\BrandService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function __construct(protected BrandService $brandService) {}

    public function index(Request $request)
    {
        $brands = $this->brandService->getBrands($request);

        return Inertia::render('master/brand', ['brands' => $brands]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand_name' => [
                'required',
                'string',
                'max:255',
            ],
        ]);
        try {
            $this->brandService->store($validated);
            $brands = $this->brandService->getBrands($request);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Brand berhasil ditambahkan.',
            ]);
            return redirect()->route('master.brand');
        } catch (\Exception $e) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, Brand $brand)
    {
        $validated = $request->validate([
            'brand_name' => [
                'required',
                'string',
                'max:255',
            ],
        ]);
        try {
            $brand->update([
                'brand_name' => $validated['brand_name'],
                'is_active' => $request->has('is_active') ? filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN) : $brand->is_active,
            ]);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Brand berhasil diupdate.',
            ]);

            return redirect()->route('master.brand');
        } catch (\Exception $e) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function destroy(Request $request, Brand $brand)
    {
        try {
            if ($brand->cars()->exists()) {
                Inertia::flash('toast', [
                    'type' => 'error',
                    'message' => 'Merek masih digunakan oleh data mobil.',
                ]);

                return redirect()->back();
            }
            $brand->delete();

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Merek berhasil dihapus.',
            ]);
            return redirect()->route('master.brand');
        } catch (\Exception $e) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
    }
}
