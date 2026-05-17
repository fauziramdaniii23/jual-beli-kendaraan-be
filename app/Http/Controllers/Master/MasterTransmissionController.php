<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class MasterTransmissionController extends Controller
{
    public function index()
    {
        return Inertia::render('master/transmission', []);
    }
}
