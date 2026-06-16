<?php

namespace App\services;

use App\Models\TradeIn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TradeInService
{
    public function getTradeIn(Request $request)
    {
        return TradeIn::with([
            'unit',
            'brand',
            'model',
            'customer',
            'order',
            'status',
        ])->get();
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            TradeIn::create([
                'car_id' => $data['car_id'],
                'order_id' => $data['order_id'],
                'brand_id' => $data['brand_id'],
                'model_id' => $data['model_id'],
                'variant' => $data['variant'],
                'year' => $data['year'],
                'kilometer' => $data['kilometer'],
                'status_code' => $data['status_code'],
                'inspection_date' => $data['inspection_date'],
            ]);
        });
    }
}
