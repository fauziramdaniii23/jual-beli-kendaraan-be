<?php

namespace App\services;

use App\Models\MasterBranch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BranchService
{
    public function get()
    {
        return MasterBranch::query()->select(['branch_id', 'name', 'address', 'phone', 'image', 'map_link'])->get();
    }
    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            $image_path = null;
            if (! empty($data['image_file'])) {
                $file = $data['image_file'];
                $image_path = $this->uploadImage($file);
            }
            MasterBranch::create([
                'name' => $data['name'],
                'address' => $data['address'],
                'map_link' => $data['map_link'],
                'phone' => $data['phone'],
                'image' => $image_path,
            ]);
        });
    }

    public function update(array $data, $branch)
    {
        return DB::transaction(function () use ($data, $branch) {

            $payload = [
                'name' => $data['name'],
                'address' => $data['address'],
                'map_link' => $data['map_link'],
                'phone' => $data['phone'],
            ];

            if (isset($data['image_file']) && $data['image_file']) {

                if ($branch->image && Storage::disk('public')->exists($branch->image)) {
                    Storage::disk('public')->delete($branch->image);
                }
                $payload['image'] = $this->uploadImage($data['image_file']);
            }

            $branch->update($payload);

            return $branch->refresh();
        });
    }

    public function delete($branch)
    {
        return DB::transaction(function () use ($branch) {
            if ($branch->image && Storage::disk('public')->exists($branch->image)) {
                Storage::disk('public')->delete($branch->image);
            }
            $branch->delete();
        });
    }

    public function uploadImage($file)
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $fileName = time().'_'.Str::slug($originalName).'.'.$file->getClientOriginalExtension();
        $avatarPath = $file->storeAs('branch', $fileName, 'public');

        return $avatarPath;
    }

    public function getBranchsWithPaginate(Request $request)
    {
        $branch = MasterBranch::query()
            ->select(['branch_id', 'name', 'address', 'phone', 'image', 'map_link'])
            ->orderBy('created_at', 'desc');

        return $branch->paginate($request->per_page ?? 10);
    }

}
