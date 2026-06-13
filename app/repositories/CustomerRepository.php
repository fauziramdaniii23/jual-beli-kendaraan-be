<?php

namespace App\repositories;

use App\Models\Customer;

class CustomerRepository
{
    public function getCustomers()
    {
        return Customer::all();
    }

}
