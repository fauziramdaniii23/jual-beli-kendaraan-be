<?php

namespace App\Helper;

use Illuminate\Support\Str;

class SlugHelper
{
    public static function generate(
        string $name,
        string $modelClass,
        string $slugColumn = 'slug',
        string $primaryKey = 'id',
        mixed $ignoreId = null,
    ): string {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (
            $modelClass::query()
                ->when(
                    $ignoreId,
                    fn ($query) => $query->where($primaryKey, '!=', $ignoreId)
                )
                ->where($slugColumn, $slug)
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
