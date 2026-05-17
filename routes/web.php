<?php

use App\Http\Controllers\Master\BrandController;
use App\Http\Controllers\Master\CarModelController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('master')->group(function () {
        Route::get('brand', [BrandController::class, 'index'])->name('master.brand');
        Route::post('brand', [BrandController::class, 'store'])->name('master.brand.store');
        Route::put('brand/{brand}', [BrandController::class, 'update'])->name('master.brand.update');
        Route::delete('brand/{brand}', [BrandController::class, 'destroy'])->name('master.brand.destroy');
        Route::get('car-model', [CarModelController::class, 'index'])->name('master.carmodel');
        Route::post('car-model', [CarModelController::class, 'store'])->name('master.carmodel.store');
        Route::put('car-model/{car_model}', [CarModelController::class, 'update'])->name('master.carmodel.update');
        Route::delete('car-model/{car_model}', [CarModelController::class, 'destroy'])->name('master.carmodel.destroy');

    });
});

require __DIR__.'/settings.php';
