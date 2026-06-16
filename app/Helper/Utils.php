<?php

namespace App\Helper;

use Illuminate\Validation\ValidationException;

class Utils
{
    public static function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone);

        if (str_starts_with($phone, '0')) {
            $phone = '62'.substr($phone, 1);
        } elseif (str_starts_with($phone, '8')) {
            $phone = '62'.$phone;
        }

        if (! preg_match('/^62[0-9]{8,15}$/', $phone)) {
            throw ValidationException::withMessages([
                'phone' => 'Format Nomor Handphone tidak valid.',
            ]);
        }

        return $phone;
    }
}
