<?php

namespace App\services;

use App\Models\Reviews;
use Illuminate\Http\Request;
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
                'car_id' => $data['car_id'],
                'customer_id' => $data['customer_id'],
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

    public function delete($review)
    {
        return DB::transaction(function () use ($review) {
            if ($review->image && Storage::disk('public')->exists($review->image)) {
                Storage::disk('public')->delete($review->image);
            }
            $review->delete();
        });
    }

    public function uploadImage($file)
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $fileName = time().'_'.Str::slug($originalName).'.'.$file->getClientOriginalExtension();
        $avatarPath = $file->storeAs('reviews', $fileName, 'public');

        return $avatarPath;
    }

    public function getReviewsWithPaginate(Request $request)
    {
        $reviews = Reviews::query()
            ->select(['review_id', 'car_id', 'customer_id', 'rating', 'review_text', 'is_published', 'image', 'created_at'])
            ->with(['unit:car_id,name', 'customer:customer_id,name'])->orderBy('created_at', 'desc');

        return $reviews->paginate($request->per_page ?? 10);
    }
}
