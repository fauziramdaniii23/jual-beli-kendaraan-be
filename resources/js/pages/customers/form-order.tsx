import { Head, router, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import {
    index as indexOrder,
    store as storeOrder,
    update as updateOrder,
} from '@/actions/App/Http/Controllers/Customer/OrderController';
import Title from '@/components/app/title';
import type { TCustomer } from '@/components/customers/customer/type';
import { defaultOrder } from '@/components/customers/orders/types';
import type { TOrder } from '@/components/customers/orders/types';
import type { TUnit } from '@/components/inventory/stock-unit/type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { TYPE_LABEL } from '@/const/constant';
import AppLayout from '@/layouts/app-layout';
import { formatRibuan, formatRupiah } from '@/lib/utils';
import type { TMasterReference } from '@/types';

type PageProps = {
    order?: TOrder;
    customers: TCustomer[];
    units: TUnit[];
    status: TMasterReference[];
    typePaid: TMasterReference[];
    orderUnit: TUnit;
    type: 'detail' | 'create' | 'update';
};

export default function FormOrderPage() {
    const { order, customers, units, status, typePaid, type, orderUnit } =
        usePage<PageProps>().props;
    const label = TYPE_LABEL[type];
    const form = useForm<TOrder>(order ?? defaultOrder);
    const disable = type === 'detail';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url =
            type === 'update' && order
                ? updateOrder(order.order_id!).url
                : storeOrder.url();

        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
            },
        });
    };

    return (
        <>
            <Head title={`${label} Order`} />
            <Title
                title={`${label} Order`}
                description={`Form ${label} Order`}
            />
            <div className="m-4">
                <form onSubmit={submit} className="mb-4 space-y-4">
                    <div className="mt-4 flex w-full gap-4">
                        <div className="flex-1">
                            <FieldGroup>
                                {type === 'create' && (
                                    <Field>
                                        <FieldLabel>
                                            Nama Customer
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Combobox
                                            items={customers}
                                            itemToStringLabel={(
                                                item: TCustomer,
                                            ) =>
                                                `${item.name} ( +${item.phone} )`
                                            }
                                            onValueChange={(
                                                val: TCustomer | null,
                                            ) =>
                                                form.setData(
                                                    'customer_id',
                                                    Number(val?.customer_id),
                                                )
                                            }
                                        >
                                            <ComboboxInput
                                                placeholder="Pilih Customer"
                                                showClear
                                            />

                                            <ComboboxContent>
                                                <ComboboxEmpty>
                                                    Customer tidak ditemukan.
                                                </ComboboxEmpty>

                                                <ComboboxList>
                                                    {(customer) => (
                                                        <ComboboxItem
                                                            key={
                                                                customer.customer_id
                                                            }
                                                            value={customer}
                                                        >
                                                            {customer.name}{' '}
                                                            <span className="italic">
                                                                (+
                                                                {customer.phone}
                                                                )
                                                            </span>
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                    </Field>
                                )}
                                <Field>
                                    <FieldLabel>Tipe Pembayaran</FieldLabel>
                                    <Select
                                        value={form.data.type_paid_code}
                                        onValueChange={(val) =>
                                            form.setData('type_paid_code', val)
                                        }
                                        disabled={disable}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Tipe Pembayaran
                                                </SelectLabel>
                                                {typePaid.map((item, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={item.ref_code}
                                                    >
                                                        {item.ref_value}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>
                                {type === 'create' && (
                                    <Field>
                                        <FieldLabel>
                                            Unit
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Combobox
                                            defaultValue={null}
                                            items={units}
                                            itemToStringLabel={(item: {
                                                car_id: string;
                                                name: string;
                                            }) => item?.name}
                                            onValueChange={(val: { car_id: string; name: string; } | null,) =>
                                                form.setData(
                                                    'car_id',
                                                    Number(val?.car_id),
                                                )
                                            }
                                            disabled={disable}
                                        >
                                            <ComboboxInput
                                                disabled={disable}
                                                placeholder="Pilih Unit"
                                                showClear
                                            />
                                            <ComboboxContent>
                                                <ComboboxEmpty>
                                                    Unit tidak ditemukan.
                                                </ComboboxEmpty>

                                                <ComboboxList>
                                                    {(unit) => (
                                                        <ComboboxItem
                                                            key={unit.car_id}
                                                            value={{
                                                                car_id: unit.car_id,
                                                                name: unit.name,
                                                            }}
                                                        >
                                                            {unit.name}
                                                            <Badge variant={unit.status.ref_code.toLowerCase()}>
                                                                {
                                                                    unit.status.ref_value
                                                                }
                                                            </Badge>
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                    </Field>
                                )}
                                <Field>
                                    <FieldLabel>Status</FieldLabel>
                                    <Select
                                        value={form.data.status_code}
                                        onValueChange={(val) =>
                                            form.setData('status_code', val)
                                        }
                                        disabled={disable}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Status
                                                </SelectLabel>
                                                {status.map((item, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={item.ref_code}
                                                    >
                                                        {item.ref_value}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </FieldGroup>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() =>
                                router.get(
                                    indexOrder().url,
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
                {(type === 'detail' || type === 'update') && (
                    <div>
                        <Card>
                            <CardHeader className="text-lg font-semibold text-gray-800">
                                Detail Customer
                            </CardHeader>
                            <CardContent>
                                <div className="flex w-full gap-4">
                                    <div className="flex-1">
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel>
                                                    Nama Customer
                                                </FieldLabel>
                                                <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                    {form.data.customer?.name ??
                                                        '-'}
                                                </div>
                                            </Field>
                                            <Field>
                                                <FieldLabel>
                                                    Email Customer
                                                </FieldLabel>
                                                <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                    {form.data.customer
                                                        ?.email ?? '-'}
                                                </div>
                                            </Field>
                                        </FieldGroup>
                                    </div>
                                    <div className="flex-1">
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel>
                                                    No Handphone
                                                </FieldLabel>
                                                <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                    +
                                                    {form.data.customer
                                                        ?.phone ?? '-'}
                                                </div>
                                            </Field>
                                            <Field>
                                                <FieldLabel>
                                                    Alamat
                                                </FieldLabel>
                                                <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                    {form.data.customer
                                                        ?.address ?? '-'}
                                                </div>
                                            </Field>
                                        </FieldGroup>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="my-4">
                            <CardHeader className="text-lg font-semibold text-gray-800">
                                Detail Unit
                            </CardHeader>
                            <CardContent>
                                <div className="flex w-full gap-4">
                                    <div className="flex-1">
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel>
                                                    Nama Unit
                                                </FieldLabel>
                                                <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                    {orderUnit.name}
                                                </div>
                                            </Field>
                                            <Field>
                                                <FieldLabel>Tahun</FieldLabel>
                                                <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                    {orderUnit.year}
                                                </div>
                                            </Field>
                                            <Field>
                                                <FieldLabel>
                                                    Total Diskon
                                                </FieldLabel>
                                                <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                    {formatRupiah(
                                                        orderUnit?.total_discount ??
                                                            0,
                                                    )}
                                                </div>
                                            </Field>
                                        </FieldGroup>
                                    </div>
                                    <div className="flex-1">
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel>Harga</FieldLabel>
                                                <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                    {formatRupiah(
                                                        orderUnit?.price ?? 0,
                                                    )}
                                                </div>
                                            </Field>
                                            <Field>
                                                <FieldLabel>
                                                    Kilometer(KM)
                                                </FieldLabel>
                                                <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                    {formatRibuan(
                                                        orderUnit?.kilometer ??
                                                            0,
                                                    )}
                                                </div>
                                            </Field>
                                            <Field>
                                                <FieldLabel>
                                                    Harga Akhir
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FieldLabel>
                                                <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold">
                                                    {formatRupiah(
                                                        orderUnit?.final_price ??
                                                            0,
                                                    )}
                                                </div>
                                            </Field>
                                        </FieldGroup>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}

FormOrderPage.layout = (page: React.ReactElement<PageProps>) => {
    const pageProps = (page.props as PageProps | undefined) ?? undefined;
    const breadcrumbTitle = pageProps?.type ? TYPE_LABEL[pageProps?.type] : '';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Customer', href: '#' },
                { title: 'Orders', href: indexOrder() },
                { title: `${breadcrumbTitle} Order`, href: '#' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
