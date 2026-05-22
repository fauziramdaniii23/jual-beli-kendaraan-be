<?php

namespace App\repositories;

use App\Models\Car;
use App\Models\CarImage;
use App\Models\MasterReference;

class StockUnitRepository
{
    public function getUnit(array $filter = [])
    {
        $query = Car::query()
            ->select(['cars_id', 'name', 'year', 'brand_id', 'model_id', 'stnk_validity_period', 'price', 'transmission_code', 'type_code', 'fuel_type_code', 'plate_code', 'seat_code', 'status_code'])
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

        return $query->get(['cars_id', 'name', 'year', 'stnk_validity_period', 'price', 'status']);
    }

    public function getUnitById($id)
    {
        $query = Car::query()
            ->with([
                'images:image_id,car_id,path,is_primary',
                'brand:brand_id,brand_name',
                'model:model_id,model_name',
                'transmission:ref_code,ref_value',
                'fuelType:ref_code,ref_value',
                'plate:ref_code,ref_value',
                'seat:ref_code,ref_value',
                'status:ref_code,ref_value',
            ]);

        return $query->findOrFail($id);
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

    public function store(array $data)
    {
        return Car::create($data);
    }

    public function update(int $id, array $data)
    {
        $car = Car::findOrFail($id);
        $car->update($data);

        return $car->fresh();
    }

    public function storeImage(int $stockUnitId, string $path): CarImage
    {
        return CarImage::create([
            'car_id' => $stockUnitId,
            'path' => $path,
        ]);
    }

    public function setPrimaryImage($cars_id, $id): void
    {
        CarImage::where('car_id', $cars_id)
            ->update([
                'is_primary' => false,
            ]);

        CarImage::where('car_id', $cars_id)
            ->where('image_id', $id)
            ->update([
                'is_primary' => true,
            ]);
    }

    public function findImage(int $imageId): ?CarImage
    {
        return CarImage::find($imageId);
    }

    public function deleteImage(int $imageId): bool
    {
        return CarImage::destroy($imageId) > 0;
    }
}
