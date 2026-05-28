<?php

namespace App\services;

use App\Helper\DateHelper;
use App\Models\Car;
use App\Models\CarImage;
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
    ) {}

    public function getUnit(Request $request)
    {
        $units = $this->stockUnitRepository->getUnit(
            filter: [
                'brand_id' => $request->brand_id,
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
                'brand_id' => $request->brand_id,
                'model_id' => $request->model_id,
                'transmission' => $request->transmission,
                'car_type' => $request->car_type,
                'fuel_type' => $request->fuel_type,
                'status' => $request->status,
            ],
            perPage: (int) $request->per_page
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

    public function getUnitById(int $id)
    {
        $stockUnit = $this->stockUnitRepository->getUnitById($id);

        $stockUnit->stnk_validity_period = DateHelper::dateFormat($stockUnit->stnk_validity_period);
        $stockUnit->kilometer = (int) $stockUnit->kilometer;
        $stockUnit->price = (float) $stockUnit->price;
        $primaryImage = $stockUnit->images->firstWhere('is_primary', true);
        $stockUnit->primary_image = $primaryImage ?? null;
        $stockUnit->primary_image_id = $primaryImage?->image_id;

        return $stockUnit;
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

            $this->stockUnitRepository->storeImage($stockUnit->cars_id, $path);
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
            $images = CarImage::where('cars_id', $id)->get();
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

    private function mapUnit($unit)
    {
        $unit->stnk_validity_period = DateHelper::dateFormat(
            $unit->stnk_validity_period
        );

        $unit->kilometer = (int) $unit->kilometer;
        $unit->price = (float) $unit->price;

        $primaryImage = $this->getPrimaryImage($unit->images);

        $unit->primary_image = $primaryImage;
        $unit->primary_image_id = $primaryImage?->image_id;

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
}
