<?php

namespace App\repositories;

use App\Models\Car;
use App\Models\MasterReference;

class StockUnitRepository
{
    public function getUnit(array $filter = [])
    {
        $query = Car::query()
            ->with([
                'brand:brand_id,brand_name',
                'model:model_id,model_name',
                'transmission:ref_code,ref_value',
                'fuelType:ref_code,ref_value',
                'plate:ref_code,ref_value',
                'seat:ref_code,ref_value',
                'status:ref_code,ref_value',
            ]);

        $columns = [
            'brand_id' => 'brand_id',
            'model_id' => 'model_id',
            'transmission' => 'transmission_code',
            'car_type' => 'type_code',
            'fuel_type' => 'fuel_type_code',
            'status' => 'status_code',
        ];

        foreach ($columns as $key => $column) {
            if (! empty($filter[$key])) {
                $query->where($column, $filter[$key]);
            }
        }

        return $query->get();
    }

    public function getOptionFilter(string $type)
    {
        return MasterReference::query()
            ->byType($type)
            ->get()
            ->map(fn ($item) => [
                'value' => $item->ref_code,
                'label' => $item->ref_value,
            ]);
    }
}
