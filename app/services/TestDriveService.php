<?php

namespace App\services;

use App\Models\TestDrive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TestDriveService
{
    public function getTestDrive(Request $request)
    {
        return TestDrive::with([
            'customer',
            'unit',
            'status',
            'branch',
        ])->get();
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            TestDrive::create([
                'customer_id' => $data['customer_id'],
                'car_id' => $data['car_id'],
                'status_code' => $data['status_code'],
                'branch_id' => $data['branch_id'],
                'test_drive_date' => $data['test_drive_date'],
            ]);
        });
    }
}
