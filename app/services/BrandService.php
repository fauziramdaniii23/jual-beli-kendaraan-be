<?php

namespace App\services;

use App\Models\MasterBrand;
use App\repositories\BrandRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BrandService
{
    public function __construct(protected BrandRepository $brandRepository) {}

    public function getAllBrands()
    {
        return $this->brandRepository->getBrands();
    }

    public function getBrands(Request $request)
    {
        return $this->brandRepository
            ->getBrands(
                filters: [
                    'status' => $request->status,
                ]
            );
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {

            return $this->brandRepository->store([
                'brand_name' => $data['brand_name'],
                'brand_code' => Str::snake($data['brand_code']),
                'logo' => $data['logo'] ?? null,
                'is_active' => true,
            ]);

        });
    }

    public function update(MasterBrand $brand, array $data)
    {
        return DB::transaction(function () use ($brand, $data) {

            return $this->brandRepository->update(
                brand: $brand,
                data: [
                    'brand_name' => $data['brand_name'],
                    'logo' => $data['logo'] ?? null,
                    'is_active' => $data['is_active'] ?? $brand->is_active,
                ]
            );
        });
    }
}
