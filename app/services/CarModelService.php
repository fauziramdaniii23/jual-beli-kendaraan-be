<?php

namespace App\services;

use App\repositories\CarModelRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CarModelService
{
    public function __construct(protected CarModelRepository $carModelRepository) {}
    public function getCarModels(Request $request)
    {
        return $this->carModelRepository
            ->getCarModels(
                filters: [
                    'status' => $request->status,
                    'brand_id' => $request->brand_id,
                ]
            );
    }
    public function store(array $data)
    {
        return DB::transaction(
            function () use ($data) {
                return $this->carModelRepository
                    ->store([
                        'model_name' => $data['model_name'],
                        'model_code' => Str::snake($data['model_name']),
                        'brand_id' => $data['brand_id'],
                        'is_active' => true,
                    ]);
            }
        );
    }
}
