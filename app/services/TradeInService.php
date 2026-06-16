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
            TradeIn::create($data);
        });
    }
}
