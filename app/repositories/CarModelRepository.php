<?php

namespace App\repositories;

use App\Models\CarModel;

class CarModelRepository
{
    public function getCarModels(array $filters = [])
    {
        return CarModel::with(['brand' => function ($query) {
            $query->select([
                'brand_id',
                'brand_name',
            ]);
        }])
            ->select([
                'model_id',
                'model_name',
                'brand_id',
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
            )->when(
                isset($filters['brand_id']),
                function ($query) use ($filters) {
                    $query->where(
                        'brand_id',
                        $filters['brand_id']
                    );
                }
            )->get();
    }
    public function store(array $data)
    {
        return CarModel::create($data);
    }
}
