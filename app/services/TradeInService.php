<?php

namespace App\services;

use App\Models\TradeIn;
use App\repositories\TradeInRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TradeInService
{
    public function __construct(protected TradeInRepository $repository) {}
    public function getTradeIn(Request $request)
    {
        return $this->repository->getTradeIn(
            filters: [
                'status_code' => $request->status_code,
                'year' => $request->year,
            ]
        );
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            TradeIn::create($data);
        });
    }
}
