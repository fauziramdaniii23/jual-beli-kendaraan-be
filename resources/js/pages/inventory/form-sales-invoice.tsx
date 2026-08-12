import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/inventory/SalesInvoiceController';
import DatePicker from '@/components/app/date-picker';
import { FileUpload } from '@/components/app/file-upload';
import Title from '@/components/app/title';
import type { TOrder } from '@/components/customers/orders/types';
import type { TSalesInvoice } from '@/components/inventory/sales-invoice/type';
import { ExistingImage } from '@/components/inventory/stock-unit/existing-image';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroupNumberFormat } from '@/components/ui/number-format-inputgroup';
import { Spinner } from '@/components/ui/spinner';
import { TYPE_LABEL } from '@/const/constant';
import AppLayout from '@/layouts/app-layout';
import type { TImageProps } from '@/types';

type PageProps = {
    orders: TOrder[];
    salesInvoice?: TSalesInvoice;
    type: 'detail' | 'create' | 'update';
};

const DEFAULT_DATA: TSalesInvoice = {
    customer_id: null,
    car_id: null,
    order_id: null,
};

export default function FormSalesInvoicePage() {
    const { orders, salesInvoice, type } = usePage<PageProps>().props;
    const label = TYPE_LABEL[type];
    const form = useForm<TSalesInvoice>(salesInvoice ?? DEFAULT_DATA);
    const disable = type === 'detail';
    const [selectOrder, setSelectOrder] = useState<TOrder | null>(null);
    const [sameFinalPrice, setSameFinalPrice] = useState<boolean>(false)

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url =
            type === 'update' && salesInvoice
                ? update(salesInvoice.sales_invoice_id!).url
                : store().url;

        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
            },
        });
    };
    const handleImageChange = (files: File[]) => {
        form.setData('upload_files', files);
    };
    const handleRemoveExistingImage = (id: number) => {
        form.setData('deleted_file_ids', [
            ...(form.data.deleted_file_ids || []),
            id,
        ]);
    };

    const existingImage: TImageProps[] =
        salesInvoice?.files?.map((file) => {
            return {
                image_id: file.sales_invoice_file_id,
                image_name: file.file_name,
                image_src: file.file_path,
            };
        }) ?? [];

    const handleSelectOrder = (order: TOrder | null) => {
        if (!order) {
            toast.error('Terjadi kesalahan, gagal memilih order');

            return;
        }

        setSelectOrder(order);
        form.setData('order_id', order.order_id);
        handleCheckboxSameFinalPrice(false);
        setSameFinalPrice(false);
    };

    const handleCheckboxSameFinalPrice = (val : boolean) => {
        if (val) {
            form.setData('final_price', selectOrder?.unit?.final_price);
        } else {
            form.setData('final_price', undefined);
        }
    }

    return (
        <>
            <Head title={`${label} Stock Unit`} />
            <Title
                title={`${label} Stock Unit`}
                description={`Form ${label} Stock Unit`}
            />
            <div className="m-4">
                <form onSubmit={submit} className="space-y-4">
                    {!disable && (
                        <FileUpload
                            onFilesSelected={handleImageChange}
                            maxFiles={10}
                            maxFileSize={5}
                        />
                    )}
                    {type !== 'create' && (
                        <ExistingImage
                            images={existingImage}
                            removeImage={handleRemoveExistingImage}
                            type={type}
                        />
                    )}
                    <div className="mt-4 flex w-full gap-4">
                        <div className="flex-1">
                            <FieldGroup>
                                {type === 'create' && (
                                    <>
                                        <Field>
                                            <FieldLabel>
                                                Pilih Order
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </FieldLabel>
                                            <Combobox
                                                items={orders}
                                                itemToStringLabel={(
                                                    item: TOrder,
                                                ) => `${item.order_uuid}`}
                                                onValueChange={(
                                                    val: TOrder | null,
                                                ) => handleSelectOrder(val)}
                                            >
                                                <ComboboxInput
                                                    placeholder="Pilih Order"
                                                    showClear
                                                />

                                                <ComboboxContent>
                                                    <ComboboxEmpty>
                                                        Order tidak ditemukan.
                                                    </ComboboxEmpty>

                                                    <ComboboxList>
                                                        {(order) => (
                                                            <ComboboxItem
                                                                key={
                                                                    order.order_id
                                                                }
                                                                value={order}
                                                            >
                                                                {
                                                                    order.order_uuid
                                                                }{' '}
                                                                <span className="italic">
                                                                    (
                                                                    {
                                                                        order
                                                                            .customer
                                                                            .name
                                                                    }{' '}
                                                                    /{' '}
                                                                    {
                                                                        order
                                                                            .customer
                                                                            .phone
                                                                    }
                                                                    ) (
                                                                    {
                                                                        order
                                                                            .unit
                                                                            .name
                                                                    }
                                                                    )
                                                                </span>
                                                            </ComboboxItem>
                                                        )}
                                                    </ComboboxList>
                                                </ComboboxContent>
                                            </Combobox>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Nama Unit</FieldLabel>
                                            <Input
                                                name="name"
                                                value={selectOrder?.unit?.name}
                                                className="input w-full"
                                                disabled={true}
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>
                                                Harga Faktur
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </FieldLabel>
                                            <InputGroupNumberFormat
                                                value={form.data.final_price}
                                                onChange={(value) =>
                                                    form.setData(
                                                        'final_price',
                                                        value,
                                                    )
                                                }
                                                disable={disable}
                                                className="input w-full"
                                                invalid={
                                                    !!form.errors.final_price
                                                }
                                            />
                                            {form.errors.final_price && (
                                                <div className="text-sm text-destructive">
                                                    {form.errors.final_price}
                                                </div>
                                            )}
                                        </Field>
                                        <Field orientation="horizontal">
                                            <Checkbox
                                                id="terms-checkbox"
                                                name="terms-checkbox"
                                                checked={sameFinalPrice}
                                                onCheckedChange={handleCheckboxSameFinalPrice}
                                                disabled={!selectOrder}
                                            />
                                            <FieldLabel htmlFor="terms-checkbox">
                                                Sama dengan harga akhir order
                                            </FieldLabel>
                                        </Field>
                                    </>
                                )}
                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Nama Customer</FieldLabel>
                                    <Input
                                        name="name"
                                        value={selectOrder?.customer?.name}
                                        className="input w-full"
                                        disabled={true}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        Tanggal Faktur
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FieldLabel>
                                    <DatePicker
                                        value={form.data.invoice_date || ''}
                                        onChange={(val) =>
                                            form.setData('invoice_date', val)
                                        }
                                        startMonth={
                                            new Date(
                                                new Date().getFullYear() - 5,
                                                11,
                                            )
                                        }
                                        endMonth={
                                            new Date(
                                                new Date().getFullYear() + 5,
                                                11,
                                            )
                                        }
                                        invalid={!!form.errors.invoice_date}
                                        disabled={disable}
                                    />
                                    {form.errors.invoice_date && (
                                        <div className="text-sm text-destructive">
                                            {form.errors.invoice_date}
                                        </div>
                                    )}
                                </Field>
                            </FieldGroup>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() =>
                                router.get(
                                    index().url,
                                    {},
                                    { preserveState: true, replace: true },
                                )
                            }
                            type="button"
                            variant="outline"
                        >
                            {disable ? 'Kembali' : 'Batal'}
                        </Button>
                        {!disable && (
                            <Button type="submit" disabled={form.processing}>
                                {form.processing && <Spinner />}
                                {form.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}

FormSalesInvoicePage.layout = (page: React.ReactElement<PageProps>) => {
    const pageProps = (page.props as PageProps | undefined) ?? undefined;
    const breadcrumbTitle = pageProps?.type ? TYPE_LABEL[pageProps?.type] : '';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Inventory', href: '#' },
                { title: 'Faktur Penjualan', href: index() },
                { title: `${breadcrumbTitle} Faktur Penjualan`, href: '#' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
