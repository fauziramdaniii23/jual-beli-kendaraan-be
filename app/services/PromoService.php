<?php

namespace App\services;

use App\Models\Promo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PromoService
{
    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            $image_path = null;
            if (! empty($data['image_file'])) {
                $file = $data['image_file'];
                $image_path = $this->uploadImage($file);
            }
            Promo::create([
                'cars_id' => $data['cars_id'],
                'user_id' => $data['user_id'],
                'rating' => $data['rating'],
                'review_text' => $data['review_text'],
                'image' => $image_path,
            ]);
        });
    }

    public function update(array $data, $promo)
    {
        return DB::transaction(function () use ($data, $promo) {

            $payload = [
                'name' => $data['name'],
                'code' => $data['code'],
                'type' => $data['type'],
                'discount_value' => $data['discount_value'],
                'description' => $data['description'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'is_active' => $data['is_active'],
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

}
