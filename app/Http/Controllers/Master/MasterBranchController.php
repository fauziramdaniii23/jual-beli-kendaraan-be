<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\MasterBranch;
use App\services\BranchService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterBranchController extends Controller
{
    public function __construct(protected BranchService $branchService) {}

    public function index()
    {
        $branch = MasterBranch::query()->select(['branch_id', 'name', 'address', 'phone', 'image', 'map_link'])->get();

        return Inertia::render('master/branch', ['branch' => $branch]);
    }

    public function form(Request $request)
    {
        $branch_id = $request->input('branch_id');
        $type = $request->input('type');
        $branch = $branch_id ? MasterBranch::query()->find($branch_id) : null;

        return Inertia::render('master/form-branch', ['branch' => $branch, 'type' => $type]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|max:255',
                'address' => 'required|max:255',
                'phone' => 'nullable|max:255',
                'image_file' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'map_link' => 'nullable|max:255',
            ]);
            $this->branchService->store($validated);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Cabang baru berhasil disimpan.',
            ]);

            return redirect()->route('master.branch');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }

    }

    public function update(Request $request, MasterBranch $branch)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|max:255',
                'address' => 'required|max:255',
                'phone' => 'nullable|max:255',
                'image_file' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'map_link' => 'nullable|max:255',
            ]);
            $this->branchService->update($validated, $branch);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Cabang berhasil disimpan.',
            ]);

            return redirect()->route('master.branch');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function destroy(MasterBranch $branch)
    {
        try {
            $this->branchService->delete($branch);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Cabang berhasil dihapus.',
            ]);

            return redirect()->route('master.branch');
        } catch (\Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }
}
