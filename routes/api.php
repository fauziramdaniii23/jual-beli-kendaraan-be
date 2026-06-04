<?php

use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

Route::get('/test', [TestController::class, 'test'])->name('test');

Route::get('/hello', function () {
    return response()->json(['message' => 'Hello, World!']);
});

Route::get('/stock-unit', [ApiController::class, 'getStockUnit'])->name('stock.unit');
Route::get('/reviews', [ApiController::class, 'getReviews'])->name('reviews');
Route::get('/branch', [ApiController::class, 'getBranch'])->name('branch');
Route::get('/faq', [ApiController::class, 'getFaq'])->name('faq');
Route::get('/promo', [ApiController::class, 'getPromo'])->name('promo');
