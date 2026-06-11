<?php

namespace App\services;

use App\Helper\DateHelper;
use App\Models\Car;
use App\Models\CarImage;
use App\Models\Promo;
use App\repositories\BrandRepository;
use App\repositories\CarModelRepository;
use App\repositories\StockUnitRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StockUnitService
{
    public function __construct(
        protected StockUnitRepository $stockUnitRepository,
        protected BrandRepository $brandRepository,
        protected CarModelRepository $carModelRepository,
        protected BranchService $branchService,
    ) {}

    public function getUnit(Request $request)
    {
        $units = $this->stockUnitRepository->getUnit(
            filter: [
                'brand_id' => $request->brand_id,
                'branch_id' => $request->branch_id,
                'model_id' => $request->model_id,
                'transmission' => $request->transmission,
                'car_type' => $request->car_type,
                'fuel_type' => $request->fuel_type,
                'status' => $request->status,
            ]
        );

        return $units->map(fn ($unit) => $this->mapUnit($unit));
    }

    public function getUnitWithPagination(Request $request)
    {
        $units = $this->stockUnitRepository->getUnitWithPagination(
            filter: [
                'promo' => $request->promo,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
                'brands' => $request->brands,
                'models' => $request->models,
                'types' => $request->types,
                'min_year' => $request->min_year,
                'max_year' => $request->max_year,
                'transmissions' => $request->transmissions,
                'fuel_types' => $request->fuel_types,
                'order_by' => $request->order_by,
            ],
        );
        $units->getCollection()->transform(
            fn ($unit) => $this->mapUnit($unit)
        );

        return $units;
    }

    public function getOptionFilter(string $type)
    {
        if ($type == 'MODEL') {
            $data = $this->carModelRepository->getCarModels([]);

            return $data->map(fn ($item) => [
                'value' => strval($item->model_id),
                'label' => $item->model_name,
                'code' => $item->model_code,
                'brand_id' => $item->brand_id,
            ]);
        }
        if ($type == 'BRANCH') {
            $data = $this->branchService->get();

            return $data->map(fn ($item) => [
                'value' => strval($item->branch_id),
                'label' => $item->name,
            ]);
        }
        if ($type == 'BRAND') {
            $data = $this->brandRepository->getBrands([]);

            return $data->map(fn ($item) => [
                'value' => (string) $item->brand_id,
                'label' => $item->brand_name,
                'code' => $item->brand_code,
                'img_src' => $item->file_src,
                'img_name' => $item->file_name,
            ]);
        }

        return $this->stockUnitRepository->getOptionFilter($type);
    }

    public function getUnitById(int $id)
    {
        $stockUnit = $this->stockUnitRepository->getUnitById($id);

        $map = $this->mapUnit($stockUnit);

        return $map;
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            $stockUnit = $this->stockUnitRepository->store([
                'name' => $data['name'],
                'description' => $data['description'],
                'brand_id' => $data['brand_id'],
                'model_id' => $data['model_id'],
                'type_code' => $data['type_code'],
                'transmission_code' => $data['transmission_code'],
                'fuel_type_code' => $data['fuel_type_code'],
                'plate_code' => $data['plate_code'],
                'seat_code' => $data['seat_code'],
                'status_code' => $data['status_code'],
                'kilometer' => $data['kilometer'],
                'year' => $data['year'],
                'engine_cc' => $data['engine_cc'],
                'color' => $data['color'],
                'price' => $data['price'],
                'stnk_validity_period' => $data['stnk_validity_period'],
                'is_active' => true,
            ]);
            if (! empty($data['image'])) {
                $this->uploadImages($stockUnit, $data['image']);
            }
            if (! empty($data['promo_ids'])) {
                $stockUnit->promos()->attach($data['promo_ids']);
            }

            return $stockUnit;
        });
    }

    public function update(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $stockUnit = $this->stockUnitRepository->update($id, $data);

            if (! empty($data['upload_images'])) {
                $this->uploadImages($stockUnit, $data['upload_images']);
            }
            if (! empty($data['deleted_image_ids'])) {
                foreach ($data['deleted_image_ids'] as $imageId) {
                    $this->deleteImage($imageId);
                }
            }
            if (! empty($data['primary_image_id'])) {
                $this->stockUnitRepository->setPrimaryImage($id, $data['primary_image_id']);
            }

            return $stockUnit;
        });
    }

    private function uploadImages($stockUnit, array $images): void
    {
        foreach ($images as $image) {
            $path = $this->uploadImage($image, 'stock-units');

            $this->stockUnitRepository->storeImage($stockUnit->car_id, $path);
        }
    }

    private function uploadImage($file, string $folder): string
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $filename = time().'_'.Str::slug($originalName).'.'.$file->getClientOriginalExtension();

        return $file->storeAs(
            $folder,       // folder tujuan → storage/app/public/stock-units
            $filename,
            'public'       // disk → config/filesystems.php
        );
    }

    public function deleteUnit(int $id)
    {
        return DB::transaction(function () use ($id) {
            $stockUnit = Car::findOrFail($id);
            $images = CarImage::where('car_id', $id)->get();
            foreach ($images as $image) {
                $this->deleteImage($image->image_id);
            }
            $stockUnit->delete();
        });
    }

    public function deleteImage(int $imageId): bool
    {
        $image = $this->stockUnitRepository->findImage($imageId);

        if (! $image) {
            return false;
        }

        // Hapus file fisik dari storage
        if (Storage::disk('public')->exists($image->path)) {
            Storage::disk('public')->delete($image->path);
        }

        // Hapus record dari database
        $this->stockUnitRepository->deleteImage($imageId);

        return true;
    }

    public function mapUnit($unit)
    {
        $unit->kilometer = (int) $unit->kilometer;
        $unit->price = (float) $unit->price;

        $primaryImage = $this->getPrimaryImage($unit->images);

        $unit->primary_image = $primaryImage;
        $unit->primary_image_id = $primaryImage?->image_id;
        $totalDiscount = 0;
        if ($unit->promos->isNotEmpty()) {
            $unit->promo_ids = $unit->promos
                ->pluck('promo_id')
                ->map(fn ($id) => (string) $id)
                ->values()
                ->toArray();
            $unit->promos = $unit->promos->map(function ($promo) use ($unit, &$totalDiscount) {
                $promo->discount_amount = Promo::calculateDiscountAmount(
                    price: $unit->price,
                    type: $promo->type,
                    discountValue: (float) $promo->discount_value
                );

                $totalDiscount += $promo->discount_amount;

                return $promo;
            });
        }
        $unit->promo_names = $unit->promos
            ->pluck('name')
            ->implode(', ');
        $unit->total_discount = $totalDiscount;
        $unit->final_price = max(0, $unit->price - $totalDiscount);

        return $unit;
    }

    private function getPrimaryImage($images)
    {
        $primary_image = null;
        if (! $images->isEmpty()) {
            $primary_image = $images->firstWhere('is_primary', true) ?? $images->first();
        }

        return $primary_image;
    }

    public function getRecommendationCars(Car $car, int $limit = 10)
    {
        return Car::query()
            ->select('cars.*')
            ->selectRaw('
            (
                CASE
                    WHEN model_id = ? THEN 50
                    ELSE 0
                END +

                CASE
                    WHEN brand_id = ? THEN 30
                    ELSE 0
                END +

                CASE
                    WHEN transmission_code = ? THEN 10
                    ELSE 0
                END +

                CASE
                    WHEN fuel_type_code = ? THEN 10
                    ELSE 0
                END +

                CASE
                    WHEN ABS(year - ?) <= 2 THEN 10
                    ELSE 0
                END +

                CASE
                    WHEN price BETWEEN ? AND ? THEN 20
                    ELSE 0
                END
            ) AS recommendation_score
        ', [
                $car->model_id,
                $car->brand_id,
                $car->transmission_code,
                $car->fuel_type_code,
                $car->year,
                $car->price * 0.8,
                $car->price * 1.2,
            ])
            ->with([
                'promos',
                'brand:brand_id,brand_name,logo_path',
                'model:model_id,model_name',
                'transmission:ref_code,ref_value',
                'fuelType:ref_code,ref_value',
                'plate:ref_code,ref_value',
                'seat:ref_code,ref_value',
                'status:ref_code,ref_value',
                'images:image_id,car_id,path,is_primary',
            ])
            ->whereNot('status_code', 'SOLD')
            ->where('is_active', true)
            ->where('car_id', '!=', $car->car_id)
            ->orderByDesc('recommendation_score')
            ->limit($limit)
            ->get();
    }
}
