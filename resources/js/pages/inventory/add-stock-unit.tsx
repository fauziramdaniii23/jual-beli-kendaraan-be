import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
import { index as indexStockUnit, store as storeUnit } from '@/actions/App/Http/Controllers/inventory/StockUnitController';
import DatePicker from '@/components/date-picker';
import { ImageUpload } from '@/components/image-upload';
import type { TUnit, TStockUnitOptions } from '@/components/inventory/stock-unit/type';
import { defaultUnit } from '@/components/inventory/stock-unit/type';
import { SelectWithClear } from '@/components/select-with-clear';
import TextEditor from '@/components/text-editor';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

type PageProps = {
    options: TStockUnitOptions;
    initial?: Partial<TUnit>;
};

export default function AddStockUnitPage() {
    const { options } = usePage<PageProps>().props;
    const form = useForm<TUnit>(defaultUnit);

    const filteredModels = useMemo(() => {
        return options.model.filter((m) => !form.data.brand_id || String(m.brand_id) === String(form.data.brand_id));
    }, [options.model, form.data.brand_id]);

    const handleBrandChange = (val: string) => {
        form.setData('brand_id', val === '' ? undefined as any : val as any);
        form.setData('model_id', ''); // reset model when brand changes
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(storeUnit.url(), {
            preserveScroll: true,
             onSuccess: () => {
                 form.reset();
             }
        })
    };

    return (
        <>
            <Head title="Tambah Stock Unit" />
            <div className="m-4">
                <form onSubmit={submit} className="space-y-4">
                    <ImageUpload
                        onImagesSelected={(files) => form.setData('image', files)}
                        maxImages={10}
                        maxFileSize={5}
                    />
                    <div className="flex gap-4 w-full mt-4">
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Nama / Label</FieldLabel>
                                    <Input
                                        name="name"
                                        value={form.data.name || ''}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        className="w-full input"
                                        aria-invalid={!!form.errors.name}
                                    />
                                    {form.errors.name && <div className="text-sm text-destructive">{form.errors.name}</div>}
                                </Field>

                                <Field>
                                    <FieldLabel>Model</FieldLabel>
                                    <SelectWithClear
                                        name="model"
                                        placeholder="Pilih Model"
                                        value={String(form.data.model_id ?? '')}
                                        onChange={(val) => form.setData('model_id', val === '' ? undefined as any : val as any)}
                                        items={filteredModels.map((m) => ({ label: m.label, value: String(m.value) }))}
                                        aria-invalid={!!form.errors.model_id}
                                    />
                                    {form.errors.model_id &&
                                        <div className="text-sm text-destructive">{form.errors.model_id}</div>}
                                </Field>

                                <Field>
                                    <FieldLabel>Transmisi</FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Transmisi"
                                        value={String(form.data.transmission_code ?? '')}
                                        onChange={(val) => form.setData('transmission_code', val === '' ? undefined as any : val as any)}
                                        items={options.transmission}
                                        aria-invalid={!!form.errors.transmission_code}
                                    />
                                    {form.errors.transmission_code &&
                                        <div className="text-sm text-destructive">{form.errors.transmission_code}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Tipe Plat</FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Tipe Plat"
                                        value={String(form.data.plate_code ?? '')}
                                        onChange={(val) => form.setData('plate_code', val === '' ? undefined as any : val as any)}
                                        items={options.plate_type || []}
                                        aria-invalid={!!form.errors.plate_code}
                                    />
                                    {form.errors.plate_code &&
                                        <div className="text-sm text-destructive">{form.errors.plate_code}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Kapasitas Mesin (CC)</FieldLabel>
                                    <Input
                                        type="number"
                                        value={form.data.engine_cc || ''}
                                        onChange={(e) => form.setData('engine_cc', e.target.value === '' ? undefined as any : e.target.value as any)}
                                        className="w-full input"
                                        aria-invalid={!!form.errors.engine_cc}
                                    />
                                    {form.errors.engine_cc &&
                                        <div className="text-sm text-destructive">{form.errors.engine_cc}</div>}
                                </Field>

                                <Field>
                                    <FieldLabel>Tanggal Berakhir STNK</FieldLabel>
                                    <DatePicker
                                        value={form.data.stnk_validity_period || ''}
                                        onChange={(val) => form.setData('stnk_validity_period', val)}
                                        startMonth={new Date(new Date().getFullYear() - 5, 11)}
                                        endMonth={new Date(new Date().getFullYear() + 5, 11)}
                                        aria-invalid={!!form.errors.stnk_validity_period}
                                    />
                                    {form.errors.stnk_validity_period &&
                                        <div className="text-sm text-destructive">{form.errors.stnk_validity_period}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Harga</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            type="number"
                                            value={String(form.data.price) || ''}
                                            onChange={(e) => form.setData('price', e.target.value === '' ? undefined as any : e.target.value as any)}
                                            className="w-full input"
                                            aria-invalid={!!form.errors.price}
                                        />
                                        <InputGroupAddon>
                                            Rp.
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {form.errors.price &&
                                        <div className="text-sm text-destructive">{form.errors.price}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Kilometer(KM)</FieldLabel>
                                    <Input
                                        type="number"
                                        value={form.data.kilometer || ''}
                                        onChange={(e) => form.setData('kilometer', e.target.value === '' ? undefined as any : e.target.value as any)}
                                        className="w-full input"
                                        aria-invalid={!!form.errors.kilometer}
                                    />
                                    {form.errors.kilometer &&
                                        <div className="text-sm text-destructive">{form.errors.kilometer}</div>}
                                </Field>
                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Merek</FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Merek"
                                        value={String(form.data.brand_id ?? '')}
                                        onChange={handleBrandChange}
                                        items={options.brand}
                                        aria-invalid={!!form.errors.brand_id}
                                    />
                                    {form.errors.brand_id &&
                                        <div className="text-sm text-destructive">{form.errors.brand_id}</div>}
                                </Field>

                                <Field>
                                    <FieldLabel>Tipe</FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Tipe"
                                        value={String(form.data.type_code ?? '')}
                                        onChange={(val) => form.setData('type_code', val === '' ? undefined as any : val as any)}
                                        items={options.car_type}
                                        aria-invalid={!!form.errors.type_code}
                                    />
                                    {form.errors.type_code &&
                                        <div className="text-sm text-destructive">{form.errors.type_code}</div>}
                                </Field>

                                <Field>
                                    <FieldLabel>Bahan Bakar</FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Bahan Bakar"
                                        value={String(form.data.fuel_type_code ?? '')}
                                        onChange={(val) => form.setData('fuel_type_code', val === '' ? undefined as any : val as any)}
                                        items={options.fuel_type}
                                        aria-invalid={!!form.errors.fuel_type_code}
                                    />
                                    {form.errors.fuel_type_code &&
                                        <div className="text-sm text-destructive">{form.errors.fuel_type_code}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Jumlah Kursi</FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Jumlalh Kursi"
                                        value={String(form.data.seat_code ?? '')}
                                        onChange={(val) => form.setData('seat_code', val === '' ? undefined as any : val as any)}
                                        items={options.seat_type || []}
                                        aria-invalid={!!form.errors.seat_code}
                                    />
                                    {form.errors.seat_code &&
                                        <div className="text-sm text-destructive">{form.errors.seat_code}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Tahun Pembuatan</FieldLabel>
                                    <Input
                                        type="number"
                                        value={form.data.year || ''}
                                        onChange={(e) => form.setData('year', e.target.value === '' ? undefined as any : e.target.value as any)}
                                        className="w-full input"
                                        aria-invalid={!!form.errors.year}
                                    />
                                    {form.errors.year &&
                                        <div className="text-sm text-destructive">{form.errors.year}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Warna</FieldLabel>
                                    <Input
                                        value={form.data.color || ''}
                                        onChange={(e) => form.setData('color', e.target.value)}
                                        className="w-full input"
                                        aria-invalid={!!form.errors.color}
                                    />
                                    {form.errors.color &&
                                        <div className="text-sm text-destructive">{form.errors.color}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Status</FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Status"
                                        value={String(form.data.status_code ?? '')}
                                        onChange={(val) => form.setData('status_code', val)}
                                        items={options.status}
                                        aria-invalid={!!form.errors.status_code}
                                    />
                                    {form.errors.status &&
                                        <div className="text-sm text-destructive">{form.errors.status}</div>}
                                </Field>
                            </FieldGroup>
                        </div>
                    </div>
                    <Field>
                        <FieldLabel>Deskripsi</FieldLabel>
                        <TextEditor
                            value={form.data.description || ''}
                            onChange={(val) => form.setData('description', val)}
                        />
                    </Field>

                    <div className="flex gap-2">
                        <Button type="button" variant="outline">
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

AddStockUnitPage.layout = {
    breadcrumbs: [
        {
            title: 'Inventory'
        },
        {
            title: 'Stock Unit',
            href: indexStockUnit()
        },
        {
            title: 'Tambah Stock Unit'
        }
    ]
};
