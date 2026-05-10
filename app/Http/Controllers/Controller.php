<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public function test()
    {
        $user = auth()->user();
        return response()->json([
            'message' => 'Hello, World!',
            'user' => $user,
        ]);
    }
}
