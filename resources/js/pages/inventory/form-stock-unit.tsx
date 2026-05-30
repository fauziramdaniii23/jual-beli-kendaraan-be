import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
import { index as indexStockUnit, store as storeUnit, update as updateUnit } from '@/actions/App/Http/Controllers/inventory/StockUnitController';
import DatePicker from '@/components/app/date-picker';
import { ImageUpload } from '@/components/app/image-upload';
import { SelectWithClear } from '@/components/app/select-with-clear';
import TextEditor from '@/components/app/text-editor';
import { ExistingImage } from '@/components/inventory/stock-unit/existing-image';
import type { TUnit, TStockUnitOptions } from '@/components/inventory/stock-unit/type';
import { defaultUnit } from '@/components/inventory/stock-unit/type';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { TYPE_LABEL } from '@/const/constant';
import AppLayout from '@/layouts/app-layout';
import type { TImageProps } from '@/types';

type PageProps = {
    options: TStockUnitOptions;
    stock_unit?: TUnit;
    type: 'detail' | 'create' | 'update';
};

export default function FormStockUnitPage() {
    const { options, stock_unit, type } = usePage<PageProps>().props;
    const label = TYPE_LABEL[type];
    const form = useForm<TUnit>(stock_unit ?? defaultUnit);
    const disable = type === 'detail';

    const filteredModels = useMemo(() => {
        return options.model.filter((m) => !form.data.brand_id || String(m.brand_id) === String(form.data.brand_id));
    }, [options.model, form.data.brand_id]);

    const handleBrandChange = (val: string) => {
        form.setData('brand_id', val === '' ? undefined as any : val as any);
        form.setData('model_id', ''); // reset model when brand changes
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = type === 'update' && stock_unit ? updateUnit(stock_unit.cars_id!).url : storeUnit.url();

        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
             onSuccess: () => {
                 form.reset();
             }
        })
    };
    const handleImageChange = (files: File[]) => {
        form.setData('upload_images', files);
    };
    const handleRemoveExistingImage = (id: number) => {
        form.setData('deleted_image_ids', [...form.data.deleted_image_ids || [], id]);
    }

    const existingImage: TImageProps[] = stock_unit?.images?.map((image) => {
        return {
            image_id: image.image_id,
            image_name: image.file_name,
            image_src: image.file_src
        };
    }) ?? [];

    return (
        <>
            <Head title={`${label} Stock Unit`} />
            <div className="m-4">
                <form onSubmit={submit} className="space-y-4">
                    { !disable &&
                        <ImageUpload
                            onImagesSelected={handleImageChange}
                            maxImages={10}
                            maxFileSize={5}
                        />
                   }
                    {
                        type !== 'create' && (
                            <ExistingImage
                                images={existingImage}
                                removeImage={handleRemoveExistingImage}
                                type={type}
                            />
                        )
                    }
                    <div className="flex gap-4 w-full mt-4">
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Nama / Label<span className="text-destructive">*</span></FieldLabel>
                                    <Input
                                        name="name"
                                        value={form.data.name || ''}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        className="w-full input"
                                        aria-invalid={!!form.errors.name}
                                        disabled={disable}
                                    />
                                    {form.errors.name && <div className="text-sm text-destructive">{form.errors.name}</div>}
                                </Field>

                                <Field>
                                    <FieldLabel>Model<span className="text-destructive">*</span></FieldLabel>
                                    <SelectWithClear
                                        name="model"
                                        placeholder="Pilih Model"
                                        value={String(form.data.model_id ?? '')}
                                        onChange={(val) => form.setData('model_id', val === '' ? undefined as any : val as any)}
                                        items={filteredModels.map((m) => ({ label: m.label, value: String(m.value) }))}
                                        invalid={!!form.errors.model_id}
                                        disabled={disable}
                                    />
                                    {form.errors.model_id && <div className="text-sm text-destructive">{form.errors.model_id}</div>}
                                </Field>

                                <Field>
                                    <FieldLabel>Transmisi</FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Transmisi"
                                        value={String(form.data.transmission_code ?? '')}
                                        onChange={(val) => form.setData('transmission_code', val === '' ? undefined as any : val as any)}
                                        items={options.transmission}
                                        invalid={!!form.errors.transmission_code}
                                        disabled={disable}
                                    />
                                    {form.errors.transmission_code && <div className="text-sm text-destructive">{form.errors.transmission_code}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Tipe Plat</FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Tipe Plat"
                                        value={String(form.data.plate_code ?? '')}
                                        onChange={(val) => form.setData('plate_code', val === '' ? undefined as any : val as any)}
                                        items={options.plate_type || []}
                                        invalid={!!form.errors.plate_code}
                                        disabled={disable}
                                    />
                                    {form.errors.plate_code && <div className="text-sm text-destructive">{form.errors.plate_code}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Kapasitas Mesin (CC)</FieldLabel>
                                    <Input
                                        type="number"
                                        value={form.data.engine_cc || ''}
                                        onChange={(e) => form.setData('engine_cc', e.target.value === '' ? undefined as any : e.target.value as any)}
                                        className="w-full input"
                                        aria-invalid={!!form.errors.engine_cc}
                                        disabled={disable}
                                    />
                                    {form.errors.engine_cc && <div className="text-sm text-destructive">{form.errors.engine_cc}</div>}
                                </Field>

                                <Field>
                                    <FieldLabel>Tanggal Berakhir STNK</FieldLabel>
                                    <DatePicker
                                        value={form.data.stnk_validity_period || ''}
                                        onChange={(val) => form.setData('stnk_validity_period', val)}
                                        startMonth={new Date(new Date().getFullYear() - 5, 11)}
                                        endMonth={new Date(new Date().getFullYear() + 5, 11)}
                                        invalid={!!form.errors.stnk_validity_period}
                                        disabled={disable}
                                    />
                                    {form.errors.stnk_validity_period && <div className="text-sm text-destructive">{form.errors.stnk_validity_period}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Harga</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            type="number"
                                            value={form.data.price || ''}
                                            onChange={(e) => form.setData('price', e.target.value === '' ? undefined as any : Number(e.target.value) as any)}
                                            className="w-full input"
                                            aria-invalid={!!form.errors.price}
                                            disabled={disable}
                                        />
                                        <InputGroupAddon>
                                            Rp.
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {form.errors.price && <div className="text-sm text-destructive">{form.errors.price}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Kilometer(KM)</FieldLabel>
                                    <Input
                                        type="number"
                                        value={form.data.kilometer || ''}
                                        onChange={(e) => form.setData('kilometer', e.target.value === '' ? undefined as any : Number(e.target.value) as any)}
                                        className="w-full input"
                                        aria-invalid={!!form.errors.kilometer}
                                        disabled={disable}
                                    />
                                    {form.errors.kilometer &&
                                        <div className="text-sm text-destructive">{form.errors.kilometer}</div>}
                                </Field>
                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Merek<span className="text-destructive">*</span></FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Merek"
                                        value={String(form.data.brand_id ?? '')}
                                        onChange={handleBrandChange}
                                        items={options.brand}
                                        invalid={!!form.errors.brand_id}
                                        disabled={disable}
                                    />
                                    {form.errors.brand_id &&
                                        <div className="text-sm text-destructive">{form.errors.brand_id}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Cabang<span className="text-destructive">*</span></FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Cabang"
                                        value={String(form.data.branch_id ?? '')}
                                        onChange={(val) => form.setData('branch_id', val === '' ? undefined as any : val as any)}
                                        items={options.branch}
                                        invalid={!!form.errors.branch_id}
                                        disabled={disable}
                                    />
                                    {form.errors.branch_id &&
                                        <div className="text-sm text-destructive">{form.errors.branch_id}</div>}
                                </Field>

                                <Field>
                                    <FieldLabel>Tipe</FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Tipe"
                                        value={String(form.data.type_code ?? '')}
                                        onChange={(val) => form.setData('type_code', val === '' ? undefined as any : val as any)}
                                        items={options.car_type}
                                        invalid={!!form.errors.type_code}
                                        disabled={disable}
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
                                        invalid={!!form.errors.fuel_type_code}
                                        disabled={disable}
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
                                        invalid={!!form.errors.seat_code}
                                        disabled={disable}
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
                                        disabled={disable}
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
                                        disabled={disable}
                                    />
                                    {form.errors.color &&
                                        <div className="text-sm text-destructive">{form.errors.color}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Status<span className="text-destructive">*</span></FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Status"
                                        value={String(form.data.status_code ?? '')}
                                        onChange={(val) => form.setData('status_code', val)}
                                        items={options.status}
                                        invalid={!!form.errors.status_code}
                                        disabled={disable}
                                    />
                                    {form.errors.status_code && <div className="text-sm text-destructive">{form.errors.status_code}</div>}
                                </Field>
                                {
                                    (type === 'update' || type === 'detail') && stock_unit && stock_unit.images!.length > 0 && (
                                        <Field>
                                            <FieldLabel>Gambar Utama</FieldLabel>
                                            <SelectWithClear
                                                placeholder={type === 'detail' ? '' : 'Pilih gambar utama'}
                                                value={String(form.data.primary_image_id ?? '')}
                                                onChange={(val) => form.setData('primary_image_id', val  === '' ? undefined as any : val as any)}
                                                items={stock_unit.images!.map((m) => ({ label: m.file_name, value: String(m.image_id) }))}
                                                invalid={!!form.errors.primary_image_id}
                                                disabled={disable}
                                            />
                                            {form.errors.primary_image_id && <div className="text-sm text-destructive">{form.errors.primary_image_id}</div>}
                                        </Field>
                                    )
                                }
                            </FieldGroup>
                        </div>
                    </div>
                    <Field>
                        <FieldLabel>Deskripsi</FieldLabel>
                        <TextEditor
                            value={form.data.description || ''}
                            onChange={(val) => form.setData('description', val)}
                            disabled={disable}
                        />
                    </Field>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => router.get(indexStockUnit().url, {}, { preserveState: true, replace: true} )}
                            type="button"
                            variant="outline">
                            {disable ? 'Kembali' : 'Batal'}
                        </Button>
                        { !disable &&
                            <Button type="submit" disabled={form.processing}>
                                {form.processing && <Spinner />}
                                {form.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        }
                    </div>
                </form>
            </div>
        </>
    );
}

FormStockUnitPage.layout = (page: React.ReactElement<PageProps>) => {
    const pageProps = (page.props as PageProps | undefined) ?? undefined;
    const breadcrumbTitle = pageProps?.type ? TYPE_LABEL[pageProps?.type] : '';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Inventory', href: '#' },
                { title: 'Stock Unit', href: indexStockUnit() },
                { title: `${breadcrumbTitle} Unit`, href: '#' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
