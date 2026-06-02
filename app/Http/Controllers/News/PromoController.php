<?php

namespace App\Http\Controllers\News;

use App\Helper\DateHelper;
use App\Http\Controllers\Controller;
use App\Models\Promo;
use App\services\PromoService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Mockery\Exception;

class PromoController extends Controller
{
    public function __construct(protected PromoService $promoService) {}

    public function index()
    {
        $promos = $this->promoService->getPromos();

        return Inertia::render('news/promo', ['promos' => $promos]);
    }

    public function form(Request $request)
    {
        try {
            $type = $request->input('type');
            $promoId = $request->input('promo_id');

            $promo = null;

            if ($promoId) {
                $promo = Promo::findOrFail($promoId);
                $promo->start_date = DateHelper::dateFormat($promo->start_date);
                $promo->end_date = DateHelper::dateFormat($promo->end_date);
            }

            return Inertia::render('news/form-promo', ['promo' => $promo, 'type' => $type]);
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
                'name' => 'required|string|max:200',
                'code' => 'required|string|max:50|unique:promos,code',
                'type' => 'required|in:percentage,fixed',
                'discount_value' => 'required|numeric|min:0',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'is_active' => 'nullable|boolean',
                'image_file' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            $this->promoService->store($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Promo berhasil disimpan.',
            ]);

            return redirect()->route('news.promos');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function update(Request $request, Promo $promo)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:200',
                'code' => [
                    'required',
                    'string',
                    'max:50',
                    Rule::unique('promos', 'code')
                        ->ignore($promo->promo_id, 'promo_id'),
                ],
                'type' => 'required|in:percentage,fixed',
                'discount_value' => 'required|numeric|min:0',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'is_active' => 'nullable|boolean',
                'image_file' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ]);
            $this->promoService->update($validated, $promo);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Promo berhasil disimpan.',
            ]);

            return redirect()->route('news.promos');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function destroy(Promo $promo)
    {
        try {
            $this->promoService->delete($promo);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Promo berhasil dihapus.',
            ]);

            return redirect()->route('news.promos');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }
}
