<?php

use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

Route::get('/test', [TestController::class, 'test'])->name('test');

Route::get('/hello', function () {
    return response()->json(['message' => 'Hello, World!']);
});

Route::prefix('unit')->group(function () {
    Route::get('', [ApiController::class, 'getStockUnit'])->name('unit');
    Route::get('/{car}', [ApiController::class, 'detailUnit'])->name('detail.unit');
});
Route::get('/reviews', [ApiController::class, 'getReviews'])->name('reviews');
Route::get('/branch', [ApiController::class, 'getBranch'])->name('branch');
Route::get('/faq', [ApiController::class, 'getFaq'])->name('faq');
Route::get('/promo', [ApiController::class, 'getPromo'])->name('promo');
Route::get('/all-promo-with-unit', [ApiController::class, 'getAllPromoWithUnit'])->name('all.promo.with.unit');
Route::get('/option-filters', [ApiController::class, 'getOptionFilters'])->name('option.filters');
