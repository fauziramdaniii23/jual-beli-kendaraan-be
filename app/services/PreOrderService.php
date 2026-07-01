<?php

namespace App\services;

use App\Models\PreOrder;
use App\repositories\PreOrderRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PreOrderService
{
    public function __construct(
        protected PreOrderRepository $preOrderRepository,
        protected CustomerService $customerService,
    ) {}

    public function getPreOrder(Request $request)
    {
        return $this->preOrderRepository->getPreOrder(
            filters: [
                'status_code' => $request->status_code,
                'year' => $request->year,
            ]
        );
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            PreOrder::create($data);
        });
    }

    public function doPreOrder(array $validated)
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
