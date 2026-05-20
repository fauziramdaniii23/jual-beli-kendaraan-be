<?php

use App\Http\Controllers\inventory\StockUnitController;
use App\Http\Controllers\Master\MasterBrandController;
use App\Http\Controllers\Master\MasterModelController;
use App\Http\Controllers\Master\MasterReferenceController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('inventory')->group(function () {
        Route::get('stock-unit', [StockUnitController::class, 'index'])->name('inventory.stock-unit');
        Route::get('stock-unit/{id}', [StockUnitController::class, 'show'])->name('inventory.stock-unit.show');
        Route::post('stock-unit', [StockUnitController::class, 'store'])->name('inventory.stock-unit.store');
        Route::put('stock-unit/{id}', [StockUnitController::class, 'update'])->name('inventory.stock-unit.update');
        Route::delete('stock-unit/{id}', [StockUnitController::class, 'destroy'])->name('inventory.stock-unit.destroy');
    });

    Route::prefix('master')->group(function () {
        Route::get('brand', [MasterBrandController::class, 'index'])->name('master.brand');
        Route::post('brand', [MasterBrandController::class, 'store'])->name('master.brand.store');
        Route::put('brand/{brand}', [MasterBrandController::class, 'update'])->name('master.brand.update');
        Route::delete('brand/{brand}', [MasterBrandController::class, 'destroy'])->name('master.brand.destroy');

        Route::get('car-model', [MasterModelController::class, 'index'])->name('master.carmodel');
        Route::post('car-model', [MasterModelController::class, 'store'])->name('master.carmodel.store');
        Route::put('car-model/{car_model}', [MasterModelController::class, 'update'])->name('master.carmodel.update');
        Route::delete('car-model/{car_model}', [MasterModelController::class, 'destroy'])->name('master.carmodel.destroy');

        Route::get('mst-reference/{type}', [MasterReferenceController::class, 'index'])->name('master.reference');
        Route::post('mst-reference/{type}', [MasterReferenceController::class, 'store'])->name('master.reference.store');
        Route::put('mst-reference/{id}', [MasterReferenceController::class, 'update'])->name('master.reference.update');
        Route::delete('mst-reference/{id}', [MasterReferenceController::class, 'destroy'])->name('master.reference.destroy');
    });
});

require __DIR__.'/settings.php';
