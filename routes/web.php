<?php

use App\Http\Controllers\inventory\StockUnitController;
use App\Http\Controllers\Master\MasterBrandController;
use App\Http\Controllers\Master\MasterModelController;
use App\Http\Controllers\Master\MasterReferenceController;
use App\Http\Controllers\Otentikasi\RoleAndPermissionController;
use App\Http\Controllers\Otentikasi\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::middleware('can:inventory.view')->prefix('inventory')->group(function () {
        Route::get('stock-unit', [StockUnitController::class, 'index'])->name('inventory.stock-unit');
        Route::get('stock-unit/create', [StockUnitController::class, 'create'])->name('inventory.stock-unit.create')->middleware('can:inventory.create');
        Route::get('stock-unit/{id}', [StockUnitController::class, 'show'])->name('inventory.stock-unit.show');
        Route::post('stock-unit', [StockUnitController::class, 'store'])->name('inventory.stock-unit.store')->middleware('can:inventory.create');
        Route::post('stock-unit/{id}', [StockUnitController::class, 'update'])->name('inventory.stock-unit.update')->middleware('can:inventory.edit');
        Route::delete('stock-unit/{id}', [StockUnitController::class, 'destroy'])->name('inventory.stock-unit.destroy')->middleware('can:inventory.delete');
    });

    Route::middleware('can:master.view')->prefix('master')->group(function () {
        Route::get('brand', [MasterBrandController::class, 'index'])->name('master.brand');
        Route::post('brand', [MasterBrandController::class, 'store'])->name('master.brand.store')->middleware('can:master.create');
        Route::post('brand/{brand}', [MasterBrandController::class, 'update'])->name('master.brand.update')->middleware('can:master.edit');
        Route::delete('brand/{brand}', [MasterBrandController::class, 'destroy'])->name('master.brand.destroy')->middleware('can:master.delete');

        Route::get('car-model', [MasterModelController::class, 'index'])->name('master.carmodel');
        Route::post('car-model', [MasterModelController::class, 'store'])->name('master.carmodel.store')->middleware('can:master.create');
        Route::put('car-model/{car_model}', [MasterModelController::class, 'update'])->name('master.carmodel.update')->middleware('can:master.edit');
        Route::delete('car-model/{car_model}', [MasterModelController::class, 'destroy'])->name('master.carmodel.destroy')->middleware('can:master.delete');

        Route::get('mst-reference/{type}', [MasterReferenceController::class, 'index'])->name('master.reference');
        Route::post('mst-reference/{type}', [MasterReferenceController::class, 'store'])->name('master.reference.store')->middleware('can:master.create');
        Route::put('mst-reference/{id}', [MasterReferenceController::class, 'update'])->name('master.reference.update')->middleware('can:master.edit');
        Route::delete('mst-reference/{id}', [MasterReferenceController::class, 'destroy'])->name('master.reference.destroy')->middleware('can:master.delete');
    });
    Route::middleware('can:otentikasi.view')->prefix('otentikasi')->group(function () {
        Route::get('role', [RoleAndPermissionController::class, 'indexRole'])->name('otentikasi.role');
        Route::post('role', [RoleAndPermissionController::class, 'storeRole'])->name('otentikasi.role.store')->middleware('can:otentikasi.create');
        Route::delete('role/{id}', [RoleAndPermissionController::class, 'destroyRole'])->name('otentikasi.role.destroy')->middleware('can:otentikasi.delete');
        Route::get('permission/{role}', [RoleAndPermissionController::class, 'indexPermission'])->name('otentikasi.permission');
        Route::put('permission/{role}', [RoleAndPermissionController::class, 'updatePermission'])->name('otentikasi.permission.update')->middleware('can:otentikasi.edit');

        Route::get('user', [UserController::class, 'index'])->name('otentikasi.user');
        Route::get('user/form', [UserController::class, 'formUser'])->name('otentikasi.form.user');
        Route::post('user', [UserController::class, 'store'])->name('otentikasi.user.store')->middleware('can:otentikasi.create');
        Route::post('user/{user}', [UserController::class, 'update'])->name('otentikasi.user.update')->middleware('can:otentikasi.edit');
        Route::delete('user/{user}', [UserController::class, 'destroy'])->name('otentikasi.user.destroy')->middleware('can:otentikasi.delete');
    });
});

require __DIR__.'/settings.php';
