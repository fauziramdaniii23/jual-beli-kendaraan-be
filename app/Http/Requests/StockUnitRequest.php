<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StockUnitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cars_id' => 'nullable|integer',

            'name' => 'required|string',
            'description' => 'nullable|string',

            'brand_id' => 'required',
            'model_id' => 'required',

            'type_code' => 'nullable|string',
            'transmission_code' => 'nullable|string',
            'fuel_type_code' => 'nullable|string',
            'plate_code' => 'nullable|string',
            'seat_code' => 'nullable|string',
            'status_code' => 'required|string',

            'kilometer' => 'nullable|integer|min:0',
            'year' => 'nullable|integer|min:1900|max:'.date('Y'),
            'engine_cc' => 'nullable|integer|min:0',

            'color' => 'nullable|string',

            'price' => 'nullable|numeric|min:0',

            'stnk_validity_period' => 'nullable|date',

            'is_active' => 'required|boolean',

            'image' => 'nullable|array',
            'image.*' => 'file|image|mimes:jpg,jpeg,png,webp|max:5048',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',

            'brand_id.required' => 'Brand wajib dipilih.',
            'model_id.required' => 'Model wajib dipilih.',

            'kilometer.integer' => 'Kilometer harus berupa angka.',
            'kilometer.min' => 'Kilometer tidak boleh negatif.',

            'year.integer' => 'Tahun harus berupa angka.',
            'year.min' => 'Tahun tidak valid.',
            'year.max' => 'Tahun tidak boleh lebih dari tahun sekarang.',

            'engine_cc.integer' => 'CC mesin harus berupa angka.',

            'price.numeric' => 'Harga harus berupa angka.',
            'price.min' => 'Harga tidak boleh negatif.',

            'stnk_validity_period.date' => 'Tanggal STNK tidak valid.',

            'is_active.required' => 'Status aktif wajib diisi.',
            'is_active.boolean' => 'Status aktif harus bernilai true atau false.',

            'image.*.image' => 'File harus berupa gambar.',
            'image.*.mimes' => 'Gambar harus berformat jpg, jpeg, png, atau webp.',
            'image.*.max' => 'Ukuran gambar maksimal 2MB.',
        ];
    }
}
