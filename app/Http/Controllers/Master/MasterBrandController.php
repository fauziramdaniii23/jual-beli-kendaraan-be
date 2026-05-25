<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\MasterBrand;
use App\services\BrandService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterBrandController extends Controller
{
    public function __construct(protected BrandService $brandService) {}

    public function index(Request $request)
    {
        $brands = $this->brandService->getBrands($request);

        return Inertia::render('master/brand', ['brands' => $brands]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'brand_name' => 'required|string|max:255',
                'is_active' => 'sometimes|boolean',
                'logo' => 'file|image|mimes:jpg,jpeg,png,webp|max:5048',
            ]);
            $this->brandService->store($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Merek berhasil ditambahkan.',
            ]);

            return redirect()->route('master.brand');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return back()->withErrors($e->getMessage());
        }
    }

    public function update(Request $request, MasterBrand $brand)
    {
        try {
            $validated = $request->validate([
                'brand_name' => 'required|string|max:255',
                'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5048',
                'is_active' => 'sometimes|boolean',
            ]);

            $this->brandService->update(
                brand: $brand,
                data: $validated
            );

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Merek berhasil diupdate.',
            ]);

            return redirect()->route('master.brand');

        } catch (\Exception $e) {

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);
            return back()->withErrors($e->getMessage());
        }
    }

    public function destroy(Request $request, MasterBrand $brand)
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
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return back()->withErrors($e->getMessage());
        }
    }
}
