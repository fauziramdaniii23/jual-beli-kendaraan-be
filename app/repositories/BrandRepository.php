<?php

namespace App\repositories;

use App\Models\Brand;

class BrandRepository
{
    public function getBrands(array $filters = [])
    {
        return Brand::query()
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
        return Brand::create($data);
    }
}
