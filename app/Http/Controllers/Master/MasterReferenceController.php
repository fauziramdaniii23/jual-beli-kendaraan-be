<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\MasterReference;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterReferenceController extends Controller
{
    public function index(Request $request, $type)
    {
        $data = MasterReference::where('ref_type', $type)
            ->select('ref_id', 'ref_code', 'ref_value', 'is_active')
            ->when(
                $request->has('status'),
                function ($query) use ($request) {
                    $query->where(
                        'is_active',
                        filter_var($request->status, FILTER_VALIDATE_BOOLEAN)
                    );
                }
            )
            ->get();

        return Inertia::render('master/reference', ['data_reference' => $data, 'type' => $type]);
    }

    public function store(Request $request, $type)
    {
        try {
            $validated = $request->validate([
                'ref_code' => ['required', 'string', 'max:255', 'unique:mst_reference,ref_code'],
                'ref_value' => ['required', 'string', 'max:255'],
            ]);
            MasterReference::create([
                'ref_type' => $type,
                'ref_code' => $validated['ref_code'],
                'ref_value' => $validated['ref_value'],
                'is_active' => true,
            ]);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Transmisi berhasil ditambahkan.',
            ]);

            return redirect()->route('master.reference');

        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return back()->withErrors($e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $transmission = MasterReference::findOrFail($id);
            $validated = $request->validate([
                'ref_value' => ['required', 'string', 'max:255'],
            ]);
            $transmission->update([
                'ref_value' => $validated['ref_value'],
                'is_active' => $request->has('is_active') ? filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN) : $transmission->is_active,
            ]);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Transmisi berhasil diperbarui.',
            ]);

            return redirect()->route('master.reference');

        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return back()->withErrors($e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $transmission = MasterReference::findOrFail($id);
            if (Car::where('transmision_code', $transmission->ref_code)->exists()) {
                Inertia::flash('toast', [
                    'type' => 'error',
                    'message' => 'Transmisi tidak dapat dihapus karena masih digunakan oleh data Mobil.',
                ]);

                return back();
            }
            $transmission->delete();

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Transmisi berhasil dihapus.',
            ]);

            return redirect()->route('master.reference');

        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return back()->withErrors($e->getMessage());
        }
    }
}
