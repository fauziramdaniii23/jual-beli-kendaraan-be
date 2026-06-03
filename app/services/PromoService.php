<?php

namespace App\services;

use App\Helper\DateHelper;
use App\Models\Car;
use App\Models\Promo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PromoService
{
    public function getPromos()
    {
        $promos = Promo::query()->orderBy('created_at', 'desc')->get();
        $promos->map(function ($promo) {
            $promo->start_date = DateHelper::dateFormat($promo->start_date);
            $promo->end_date = DateHelper::dateFormat($promo->end_date);
        });

        return $promos;
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            $image_path = null;
            if (! empty($data['image_file'])) {
                $file = $data['image_file'];
                $image_path = $this->uploadImage($file);
            }

            return Promo::create([
                'name' => $data['name'],
                'code' => $data['code'],
                'type' => $data['type'],
                'discount_value' => $data['discount_value'],
                'description' => $data['description'] ?? null,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'image' => $image_path,
            ]);
        });
    }

    public function storePromoToUnit(Promo $promo, array $dataFilter, bool $selectAll, bool $unSelectAll, $listUnit): void
    {
        if ($selectAll || $unSelectAll) {
            $columns = [
                'brand_id' => 'brand_id',
                'branch_id' => 'branch_id',
                'model_id' => 'model_id',
                'transmission' => 'transmission_code',
                'car_type' => 'type_code',
                'fuel_type' => 'fuel_type_code',
                'status' => 'status_code',
            ];

            $query = Car::query()->whereNot('status_code', 'SOLD');
            foreach ($columns as $key => $column) {
                if (! empty($dataFilter[$key])) {
                    $query->where($column, $dataFilter[$key]);
                }
            }
            $units = $query->get();
            foreach ($units as $unit) {
                $selectAll ? $unit->promos()->attach($promo->promo_id) : $unit->promos()->detach($promo->promo_id);
            }

            return;
        }

        $units = Car::query()
            ->whereIn(
                'cars_id',
                collect($listUnit)->pluck('cars_id')
            )
            ->get()
            ->keyBy('cars_id');

        foreach ($listUnit as $item) {
            if (! isset($units[$item['cars_id']])) {
                continue;
            }

            if ($item['has_promo']) {
                $units[$item['cars_id']]->promos()->syncWithoutDetaching([$promo->promo_id]);
            } else {
                $units[$item['cars_id']]->promos()->detach($promo->promo_id);
            }
        }

    }

    public function update(array $data, $promo)
    {
        return DB::transaction(function () use ($data, $promo) {

            $payload = [
                'name' => $data['name'],
                'code' => $data['code'],
                'type' => $data['type'],
                'discount_value' => $data['discount_value'],
                'description' => $data['description'] ?? null,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ];

            if (isset($data['image_file']) && $data['image_file']) {

                if ($promo->image && Storage::disk('public')->exists($promo->image)) {
                    Storage::disk('public')->delete($promo->image);
                }
                $payload['image'] = $this->uploadImage($data['image_file']);
            }

            $promo->update($payload);

            return $promo->refresh();
        });
    }

    public function delete($promo)
    {
        return DB::transaction(function () use ($promo) {
            if ($promo->image && Storage::disk('public')->exists($promo->image)) {
                Storage::disk('public')->delete($promo->image);
            }
            $promo->delete();
        });
    }

    public function uploadImage($file)
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $fileName = time().'_'.Str::slug($originalName).'.'.$file->getClientOriginalExtension();
        $avatarPath = $file->storeAs('promos', $fileName, 'public');

        return $avatarPath;
    }

    public function mapPromoStockUnit(Promo $promo, $stockUnit)
    {
        return $stockUnit->map(function ($unit) use ($promo) {
            $unit->has_promo = $unit->promos->contains('promo_id', $promo->promo_id);

            return $unit;
        });
    }
}
