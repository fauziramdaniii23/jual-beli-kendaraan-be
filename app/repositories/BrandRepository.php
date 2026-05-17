<?php

namespace App\repositories;

use App\Models\MasterBrand;

class BrandRepository
{
    public function getBrands(array $filters = [])
    {
        return MasterBrand::query()
            ->select([
                'brand_id',
                'brand_name',
                'is_active',
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
            )
            ->get();
    }

    public function store(array $data)
    {
        return MasterBrand::create($data);
    }
}
