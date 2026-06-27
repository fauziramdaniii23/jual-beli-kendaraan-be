<?php

namespace App\services;

use App\Models\SellSubmission;
use App\repositories\SellSubmissionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SellSubmissionService
{
    public function __construct(protected SellSubmissionRepository $repository) {}
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
}
