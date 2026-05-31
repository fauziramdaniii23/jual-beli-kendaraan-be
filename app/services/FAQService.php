<?php

namespace App\services;

use App\Models\FAQ;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FAQService
{
    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            FAQ::create([
                'question' => $data['question'],
                'answer' => $data['answer'],
                'category_code' => $data['category_code'],
                'sort_order' => $data['sort_order'],
            ]);
        });
    }

    public function update(array $data, $faq)
    {
        return DB::transaction(function () use ($data, $faq) {

            $payload = [
                'question' => $data['question'],
                'answer' => $data['answer'],
                'category_code' => $data['category_code'],
                'sort_order' => $data['sort_order'],
            ];

            $faq->update($payload);

            return $faq->refresh();
        });
    }

    public function getFaq(Request $request)
    {
        $faq = FAQ::query()
            ->with(['category:ref_id,ref_code,ref_value'])
            ->select(['faq_id', 'question', 'answer', 'category_code', 'sort_order', 'is_published'])
            ->orderBy('created_at', 'desc');

        if (! empty($request->category)) {
            $faq->where('category_code', $request->category);
        }

        return $faq->get();
    }
}
