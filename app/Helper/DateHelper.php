<?php

namespace App\Helper;

use Carbon\Carbon;

class DateHelper
{
    public static function dateFormat($date, string $format = 'd-m-Y')
    {
        return $date
            ? Carbon::parse($date)->format($format)
            : null;
    }
    public static function combine(?string $date, ?string $time): ?Carbon
    {
        if (empty($date) || empty($time)) {
            return null;
        }

        return Carbon::createFromFormat(
            'Y-m-d H:i',
            "{$date} {$time}"
        );
    }
}
