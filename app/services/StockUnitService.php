<?php

namespace App\services;

use App\repositories\BrandRepository;
use App\repositories\CarModelRepository;
use App\repositories\StockUnitRepository;
use Illuminate\Http\Request;

class StockUnitService
{
    public function __construct(
        protected StockUnitRepository $stockUnitRepository,
        protected BrandRepository $brandRepository,
        protected CarModelRepository $carModelRepository,
    ) {}

    public function getUnit(Request $request)
    {
        return $this->stockUnitRepository
            ->getUnit(
                filter: [
                    'brand_id' => $request->brand_id,
                    'model_id' => $request->model_id,
                    'transmission' => $request->transmission,
                    'car_type' => $request->car_type,
                    'fuel_type' => $request->fuel_type,
                    'status' => $request->status,
                ]
            );
    }

    public function getOptionFilter(string $type)
    {
        if ($type == 'MODEL') {
            $data = $this->carModelRepository->getCarModels([]);
            return $data->map(fn ($item) => [
                'value' => strval($item->model_id),
                'label' => $item->model_name,
                'brand_id' => $item->brand_id,
            ]);
        }
        if ($type == 'BRAND') {
            $data = $this->brandRepository->getBrands([]);
            return $data->map(fn ($item) => [
                'value' => (string) $item->brand_id,
                'label' => $item->brand_name,
            ]);
        }

        return $this->stockUnitRepository->getOptionFilter($type);
    }
}
