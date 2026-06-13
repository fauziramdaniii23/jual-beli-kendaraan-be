<?php

namespace App\services;

use App\Models\Customer;
use App\repositories\CustomerRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public function __construct(protected CustomerRepository $customerRepository) {}
    public function getCustomer(Request $request)
    {
        return $this->customerRepository->getCustomers();
    }
    public function store(array $data)
    {
        return DB::transaction(
            function () use ($data) {
                return Customer::create($data);
            }
        );
    }

}
