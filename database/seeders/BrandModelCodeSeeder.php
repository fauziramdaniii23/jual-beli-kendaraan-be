<?php

namespace Database\Seeders;

use App\Models\MasterBrand;
use App\Models\MasterModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandModelCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $model = MasterModel::query()->select(['model_id', 'model_name'])->get();

        foreach ($model as $m) {
            $m->update([
                'model_code' => Str::snake($m->model_name),
            ]);
        }

        $brand = MasterBrand::query()->select(['brand_id', 'brand_name'])->get();

        foreach ($brand as $b) {
            $b->update([
                'brand_code' => Str::snake($b->brand_name),
            ]);
        }
    }
}
