<?php

use App\Http\Controllers\Controller;
use App\Http\Controllers\inventory\StockUnitController;
use Illuminate\Support\Facades\Route;

Route::get('/test', [Controller::class, 'test'])->middleware('auth:sanctum');

Route::get('/hello', function () {
    return response()->json(['message' => 'Hello, World!']);
});

Route::get('/stock-unit', [StockUnitController::class, 'getStockUnit'])->name('stock.unit');
