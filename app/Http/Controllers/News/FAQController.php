<?php

namespace App\Http\Controllers\News;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\FAQ;
use App\Models\MasterReference;
use App\Models\Reviews;
use App\Models\User;
use App\services\FAQService;
use App\services\ReviewService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Mockery\Exception;

class FAQController extends Controller
{
    public function __construct(protected FAQService $faqService) {}

    public function index(Request $request)
    {
        $faqs = $this->faqService->getFaq($request);

        $category = MasterReference::byType('FAQ_TYPE')->get();

        return Inertia::render('news/faq', ['faqs' => $faqs, 'categories' => $category]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'question' => 'required|string',
                'answer' => 'required|string',
                'category_code' => 'required|exists:mst_reference,ref_code',
                'sort_order' => 'required|numeric',
            ]);

            $this->faqService->store($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'FAQ berhasil disimpan.',
            ]);

            return redirect()->route('news.faq');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function update(Request $request, FAQ $faq)
    {
        try {
            $validated = $request->validate([
                'question' => 'required|string',
                'answer' => 'required|string',
                'category_code' => 'required|exists:mst_reference,ref_code',
                'sort_order' => 'required|numeric',
                'is_published' => 'required|boolean',
            ]);
            $this->faqService->update($validated, $faq);
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'FAQ berhasil disimpan.',
            ]);

            return redirect()->route('news.faq');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }

    public function destroy(FAQ $faq)
    {
        try {
            $faq->delete();
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'FAQ berhasil dihapus.',
            ]);

            return redirect()->route('news.faq');
        } catch (Exception $e) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage(),
            ]);

            return redirect()->back();
        }
    }
}
