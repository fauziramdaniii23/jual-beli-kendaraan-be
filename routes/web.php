<?php

use App\Http\Controllers\Master\MasterModelController;
use App\Http\Controllers\Master\MasterBrandController;
use App\Http\Controllers\Master\MasterTransmissionController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('master')->group(function () {
        Route::get('brand', [MasterBrandController::class, 'index'])->name('master.brand');
        Route::post('brand', [MasterBrandController::class, 'store'])->name('master.brand.store');
        Route::put('brand/{brand}', [MasterBrandController::class, 'update'])->name('master.brand.update');
        Route::delete('brand/{brand}', [MasterBrandController::class, 'destroy'])->name('master.brand.destroy');

        Route::get('car-model', [MasterModelController::class, 'index'])->name('master.carmodel');
        Route::post('car-model', [MasterModelController::class, 'store'])->name('master.carmodel.store');
        Route::put('car-model/{car_model}', [MasterModelController::class, 'update'])->name('master.carmodel.update');
        Route::delete('car-model/{car_model}', [MasterModelController::class, 'destroy'])->name('master.carmodel.destroy');

        Route::get('transmission', [MasterTransmissionController::class, 'index'])->name('master.transmission');
        Route::post('transmission', [MasterTransmissionController::class, 'store'])->name('master.transmission.store');
        Route::put('transmission/{id}', [MasterTransmissionController::class, 'update'])->name('master.transmission.update');
        Route::delete('transmission/{id}', [MasterTransmissionController::class, 'destroy'])->name('master.transmission.destroy');
    });
});

require __DIR__.'/settings.php';
