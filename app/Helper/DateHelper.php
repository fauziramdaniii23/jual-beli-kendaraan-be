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
}
