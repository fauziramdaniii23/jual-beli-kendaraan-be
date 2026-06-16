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
        return $this->customerRepository->getCustomers(
            filters: [
                'is_active' => $request->is_active,
            ]
        );
    }
    public function store(array $data)
    {
        return DB::transaction(
            function () use ($data) {
                return Customer::create($data);
            }
        );
    }
    public function updateOrCreate(array $data)
    {
        return DB::transaction(
            function () use ($data) {
                return Customer::updateOrCreate(
                    [
                        'phone' => $data['phone'],
                    ],
                    [
                        'name' => $data['name'],
                        'email' => $data['email'],
                        'address' => $data['address'],
                    ]
                );
            }
        );
    }
}
