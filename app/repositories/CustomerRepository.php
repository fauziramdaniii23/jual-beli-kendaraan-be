<?php

namespace App\repositories;

use App\Models\Customer;
use Illuminate\Support\Collection;

class CustomerRepository
{
    public function getCustomers(array $filters = [])
    {
        return Customer::query()
            ->when(! empty($filters['is_active']),
                fn ($query) => $query->where('is_active', $filters['is_active'])
            )->latest()->get();
    }
}
