<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Reviews;
use App\Models\User;
use App\services\ReviewService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Mockery\Exception;

class ReviewsController extends Controller
{
    public function __construct(protected ReviewService $reviewService) {}

    public function index()
    {
        $data = Reviews::with([
            'unit:car_id,name',
            'user:id,name',
        ])->orderBy('created_at', 'desc')->get();

        return Inertia::render('customers/reviews', ['reviews' => $data]);
    }

    public function form(Request $request)
    {
        try {
            $type = $request->input('type');
            $reviewId = $request->input('review_id');

            $reviews = $reviewId ? Reviews::with([
                'unit:car_id,name',
                'user:id,name',
            ])->findOrFail($reviewId) : null;

            $users = $type === 'create' ? User::query()->select(['id', 'name'])->get() : null;
            $units = $type === 'create' ? Car::query()->with('status:ref_code,ref_value')->select(['car_id', 'name', 'status_code'])->whereNot('status_code', 'SOLD')->get() : null;

            return Inertia::render('customers/form-reviews', ['units' => $units, 'reviews' => $reviews, 'users' => $users, 'type' => $type]);
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'car_id' => 'required|exists:cars,car_id',
                'user_id' => 'required|exists:users,id',
                'rating' => 'required|numeric|min:1|max:5',
                'review_text' => 'nullable|string',
                'image_file' => 'nullable|image|mimes:jpeg,png,jpg',
            ]);

            $this->reviewService->store($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Rating & Ulasan Customer berhasil disimpan.',
            ]);

            return redirect()->route('customer.reviews');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function update(Request $request, Reviews $review)
    {
        try {
            $validated = $request->validate([
                'car_id' => 'required|exists:cars,car_id',
                'user_id' => 'required|exists:users,id',
                'rating' => 'required|numeric|min:1|max:5',
                'review_text' => 'nullable|string',
                'is_published' => 'nullable|boolean',
                'image_file' => 'nullable|image|mimes:jpeg,png,jpg',
            ]);
            $this->reviewService->update($validated, $review);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Rating & Ulasan Customer berhasil disimpan.',
            ]);

            return redirect()->route('customer.reviews');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function destroy(Reviews $review)
    {
        try {
            $this->reviewService->delete($review);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Rating & Ulasan Customer berhasil dihapus.',
            ]);

            return redirect()->route('customer.reviews');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }
}
