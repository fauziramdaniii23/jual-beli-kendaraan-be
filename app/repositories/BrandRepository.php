<?php

namespace App\repositories;

use App\Models\MasterBrand;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BrandRepository
{
    public function getBrands(array $filters = [])
    {
        return MasterBrand::query()
            ->select([
                'brand_id',
                'brand_name',
                'is_active',
                'logo_path',
            ])
            ->when(
                isset($filters['status']),
                function ($query) use ($filters) {
                    $query->where(
                        'is_active',
                        filter_var(
                            $filters['status'],
                            FILTER_VALIDATE_BOOLEAN
                        )
                    );
                }
            )->orderBy('created_at', 'desc')
            ->get();
    }

    public function store(array $data)
    {
        $logoPath = null;

        if (isset($data['logo']) && $data['logo']) {

            $file = $data['logo'];

            $originalName = pathinfo(
                $file->getClientOriginalName(),
                PATHINFO_FILENAME
            );

            $filename = time().'_'.Str::slug($originalName).'.'.$file->getClientOriginalExtension();

            $logoPath = $file->storeAs(
                'brand-logo',
                $filename,
                'public'
            );
        }

        return MasterBrand::create([
            'brand_name' => $data['brand_name'],
            'logo' => $logoPath,
            'is_active' => $data['is_active'],
        ]);
    }

    public function update(MasterBrand $brand, array $data)
    {

        $updateData = [
            'brand_name' => $data['brand_name'],
            'is_active' => $data['is_active'],
        ];

        if (isset($data['logo']) && $data['logo']) {

            if ($brand->logo_path && Storage::disk('public')->exists($brand->logo_path)) {
                Storage::disk('public')->delete($brand->logo_path);
            }

            $file = $data['logo'];

            $originalName = pathinfo(
                $file->getClientOriginalName(),
                PATHINFO_FILENAME
            );

            $filename = time().'_'.Str::slug($originalName).'.'.$file->getClientOriginalExtension();

            $logoPath = $file->storeAs(
                'brand-logo',
                $filename,
                'public'
            );

            $updateData['logo_path'] = $logoPath;
        }

        $brand->update($updateData);

        return $brand->fresh();
    }
}
