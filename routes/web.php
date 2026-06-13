<?php

use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Customer\ReviewsController;
use App\Http\Controllers\inventory\StockUnitController;
use App\Http\Controllers\Master\MasterBranchController;
use App\Http\Controllers\Master\MasterBrandController;
use App\Http\Controllers\Master\MasterModelController;
use App\Http\Controllers\Master\MasterReferenceController;
use App\Http\Controllers\News\FAQController;
use App\Http\Controllers\News\PromoController;
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

    Route::middleware('can:customer.view')->prefix('customer')->group(function () {
        Route::get('', [CustomerController::class, 'index'])->name('customer');
        Route::post('', [CustomerController::class, 'store'])->name('customer.store')->middleware('can:customer.create');
        Route::put('{customer}', [CustomerController::class, 'update'])->name('customer.update')->middleware('can:customer.edit');
        Route::delete('{customer}', [CustomerController::class, 'destroy'])->name('customer.destroy')->middleware('can:customer.delete');

        Route::get('orders', [OrderController::class, 'index'])->name('customer.orders');

        Route::get('reviews', [ReviewsController::class, 'index'])->name('customer.reviews');
        Route::get('reviews/form', [ReviewsController::class, 'form'])->name('customer.reviews.form');
        Route::post('reviews', [ReviewsController::class, 'store'])->name('customer.reviews.store')->middleware('can:customer.create');
        Route::post('reviews/{review}', [ReviewsController::class, 'update'])->name('customer.reviews.update')->middleware('can:customer.edit');
        Route::delete('reviews/{review}', [ReviewsController::class, 'destroy'])->name('customer.reviews.destroy')->middleware('can:customer.delete');
    });

    Route::middleware('can:news.view')->prefix('news')->group(function () {
        Route::get('faq', [FAQController::class, 'index'])->name('news.faq');
        Route::post('faq', [FAQController::class, 'store'])->name('news.faq.store')->middleware('can:news.create');
        Route::post('faq/{faq}', [FAQController::class, 'update'])->name('news.faq.update')->middleware('can:news.edit');
        Route::delete('faq/{faq}', [FAQController::class, 'destroy'])->name('news.faq.destroy')->middleware('can:news.delete');

        Route::get('promos', [PromoController::class, 'index'])->name('news.promos');
        Route::get('promos/form', [PromoController::class, 'form'])->name('news.promos.form');
        Route::post('promos', [PromoController::class, 'store'])->name('news.promos.store')->middleware('can:news.create');
        Route::get('promos/add-to-unit/{promo}', [PromoController::class, 'addPromoToUnit'])->name('news.promos.addtounit');
        Route::post('promos/{promo}', [PromoController::class, 'update'])->name('news.promos.update')->middleware('can:news.edit');
        Route::post('promos/{promo}/add-to-unit', [PromoController::class, 'storePromoToUnit'])->name('news.promos.posttounit')->middleware('can:news.edit');
        Route::delete('promos/{promo}', [PromoController::class, 'destroy'])->name('news.promos.destroy')->middleware('can:news.delete');
    });

    Route::middleware('can:master.view')->prefix('master')->group(function () {

        Route::get('branch', [MasterBranchController::class, 'index'])->name('master.branch');
        Route::get('branch/form', [MasterBranchController::class, 'form'])->name('master.branch.form');
        Route::post('branch', [MasterBranchController::class, 'store'])->name('master.branch.store')->middleware('can:master.create');
        Route::post('branch/{branch}', [MasterBranchController::class, 'update'])->name('master.branch.update')->middleware('can:master.edit');
        Route::delete('branch/{branch}', [MasterBranchController::class, 'destroy'])->name('master.branch.destroy')->middleware('can:master.delete');

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
