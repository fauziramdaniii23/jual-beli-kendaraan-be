<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CarSlugSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cars = DB::table('cars')->get();

        foreach ($cars as $car) {

            $baseSlug = Str::slug($car->name);
            $slug = $baseSlug;
            $counter = 1;

            while (
                DB::table('cars')
                    ->where('slug', $slug)
                    ->where('car_id', '!=', $car->car_id)
                    ->exists()
            ) {
                $slug = $baseSlug.'-'.$counter;
                $counter++;
            }

            DB::table('cars')
                ->where('car_id', $car->car_id)
                ->update([
                    'slug' => $slug,
                ]);
        }
    }
}
