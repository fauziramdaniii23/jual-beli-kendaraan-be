<?php

namespace App\repositories;

use App\Models\SellSubmission;

class SellSubmissionRepository
{
    public function getSellSubmission(array $filters = [])
    {
        return SellSubmission::with([
            'customer',
            'status',
        ])
            ->when(! empty($filters['status_code']),
                fn ($query) => $query->where('status_code', $filters['status_code'])
            )
            ->when(! empty($filters['year']),
                fn ($query) => $query->where('year', $filters['year'])
            )
            ->latest()
            ->get();
    }
}
