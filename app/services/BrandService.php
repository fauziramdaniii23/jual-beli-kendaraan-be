<?php

namespace App\services;

use App\Models\Brand;
use App\repositories\BrandRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BrandService
{
    public function __construct(protected BrandRepository $brandRepository) {}

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
        return DB::transaction(
            function () use ($data) {
                return $this->brandRepository
                    ->store([
                        'brand_name' => $data['brand_name'],
                        'is_actived' => true,
                    ]);
            }
        );
    }
}
