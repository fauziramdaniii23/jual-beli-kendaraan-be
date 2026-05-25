<?php

use App\Http\Controllers\inventory\StockUnitController;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

Route::get('/test', [TestController::class, 'test'])->name('test');

Route::get('/hello', function () {
    return response()->json(['message' => 'Hello, World!']);
});

Route::get('/stock-unit', [StockUnitController::class, 'getStockUnit'])->name('stock.unit');
