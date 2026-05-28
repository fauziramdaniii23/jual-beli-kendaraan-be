<?php

namespace App\services;

use App\Models\Reviews;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReviewService
{
    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            $image_path = null;
            if (! empty($data['image_file'])) {
                $file = $data['image_file'];
                $image_path = $this->uploadImage($file);
            }
            Reviews::create([
                'cars_id' => $data['cars_id'],
                'user_id' => $data['user_id'],
                'rating' => $data['rating'],
                'review_text' => $data['review_text'],
                'image' => $image_path,
            ]);
        });
    }
    public function update(array $data, $review)
    {
        return DB::transaction(function () use ($data, $review) {

            $payload = [
                'rating' => $data['rating'],
                'review_text' => $data['review_text'],
                'is_published' => $data['is_published'],
            ];

            if (isset($data['image_file']) && $data['image_file']) {

                if ($review->image && Storage::disk('public')->exists($review->image)) {
                    Storage::disk('public')->delete($review->image);
                }
                $payload['image'] = $this->uploadImage($data['image_file']);
            }

            $review->update($payload);

            return $review->refresh();
        });
    }
    public function uploadImage($file)
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $fileName = time().'_'.Str::slug($originalName).'.'.$file->getClientOriginalExtension();
        $avatarPath = $file->storeAs('reviews', $fileName, 'public');

        return $avatarPath;
    }
}
