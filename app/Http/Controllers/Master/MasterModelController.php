<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\MasterModel;
use App\services\BrandService;
use App\services\CarModelService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MasterModelController extends Controller
{
    public function __construct(protected CarModelService $carModelService, protected BrandService $brandService) {}

    public function index(Request $request)
    {
        $carModels = $this->carModelService->getCarModels($request);
        $brands = $this->brandService->getAllBrands();

        return Inertia::render('master/model', ['carModels' => $carModels, 'brands' => $brands]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'model_name' => ['required', 'string', 'max:255'],
                'brand_id' => ['required', 'integer', 'exists:brand,brand_id'],
            ]);

            $this->carModelService->store($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Model berhasil ditambahkan.',
            ]);

            return redirect()->route('master.carmodel');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);
            return back()->withErrors($e->getMessage());
        }
    }

    public function update(Request $request, MasterModel $carModel)
    {
        try {
            $request->merge(['is_active' => filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN)]);
            $validated = $request->validate([
                'model_name' => ['required', 'string', 'max:255'],
                'brand_id' => ['required', 'integer', 'exists:brand,brand_id'],
                'is_active' => ['sometimes', 'boolean'],
            ]);

            $carModel->update([
                'model_name' => $validated['model_name'],
                'model_code' => Str::snake($validated['model_name']),
                'brand_id' => $validated['brand_id'],
                'is_active' => $validated['is_active'],
            ]);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Model berhasil diupdate.',
            ]);

            return redirect()->route('master.carmodel');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return back()->withErrors($e->getMessage());
        }
    }

    public function destroy(Request $request, MasterModel $carModel)
    {
        try {
            if ($carModel->cars()->exists()) {
                Inertia::flash('toast', [
                    'type' => 'error',
                    'message' => 'Model masih digunakan oleh data mobil.',
                ]);

                return redirect()->back();
            }

            $carModel->delete();

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Model berhasil dihapus.',
            ]);

            return redirect()->route('master.carmodel');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);
            return back()->withErrors($e->getMessage());
        }
    }
}
