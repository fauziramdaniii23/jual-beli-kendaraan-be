<?php

namespace App\services;

use App\Models\SellSubmission;
use App\repositories\SellSubmissionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SellSubmissionService
{
    public function __construct(
        protected SellSubmissionRepository $repository,
        protected CustomerService $customerService,
    ) {}

    public function getSellSubmission(Request $request)
    {
        return $this->repository->getSellSubmission(
            filters: [
                'status_code' => $request->status_code,
                'year' => $request->year,
            ]
        );
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            SellSubmission::create($data);
        });
    }

    public function doSellSubmission(array $validated)
    {
        return DB::transaction(function () use ($validated) {
            $customer = $this->customerService->updateOrCreate($validated);

            $this->store([
                'customer_id' => $customer->customer_id,
                'brand' => $validated['brand'],
                'model' => $validated['model'],
                'variant' => $validated['variant'],
                'year' => $validated['year'],
                'kilometer' => $validated['kilometer'],
                'inspection_date' => $validated['inspection_date'],
                'expectation_price' => $validated['expectation_price'],
            ]);
        });

    }
}
