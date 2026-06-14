import { Head, router, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { index as indexOrder, store as storeOrder, update as updateOrder } from '@/actions/App/Http/Controllers/Customer/OrderController';
import Title from '@/components/app/title';
import type { TCustomer } from '@/components/customers/customer/type';
import { defaultOrder  } from '@/components/customers/orders/types';
import type {TOrder} from '@/components/customers/orders/types';
import type { TUnit } from '@/components/inventory/stock-unit/type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList
} from '@/components/ui/combobox';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { TYPE_LABEL } from '@/const/constant';
import AppLayout from '@/layouts/app-layout';
import type { TMasterReference } from '@/types';

type PageProps = {
    order?: TOrder;
    customers: TCustomer[];
    units: TUnit[];
    status: TMasterReference[];
    typePaid: TMasterReference[];
    type: 'detail' | 'create' | 'update';
};

export default function FormOrderPage() {
    const { order, customers, units, status, typePaid, type, } = usePage<PageProps>().props;
    const label = TYPE_LABEL[type];
    const form = useForm<TOrder>(order ?? defaultOrder);
    const disable = type === 'detail';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = type === 'update' && order ? updateOrder(order.order_id!).url : storeOrder.url();

        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
            }
        })
    };

    return (
        <>
            <Head title={`${label} Order`} />
            <Title title={`${label} Order`} description={`Form ${label} Order`} />
            <div className="m-4">
                <form onSubmit={submit} className="space-y-4">
                    <div className="flex gap-4 w-full mt-4">
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Nama<span className="text-destructive">*</span></FieldLabel>
                                    {type === 'detail' || type === 'update' ? (
                                        <Input
                                            name="name"
                                            value={form.data.customer?.name || ''}
                                            className="w-full input"
                                            disabled={true}
                                        />
                                    ) : (
                                        <Combobox
                                            items={customers}
                                            itemToStringLabel={(item : TCustomer) => item.name}
                                            onValueChange={(val : TCustomer | null) => form.setData('customer_id', Number(val?.customer_id))}
                                        >
                                            <ComboboxInput placeholder="Pilih Customer" showClear/>

                                            <ComboboxContent>
                                                <ComboboxEmpty>Customer tidak ditemukan.</ComboboxEmpty>

                                                <ComboboxList>
                                                    {(customer) => (
                                                        <ComboboxItem
                                                            key={customer.customer_id}
                                                            value={customer}
                                                        >
                                                            {customer.name}
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel>Tipe Pembayaran</FieldLabel>
                                    <Select
                                        value={form.data.type_paid_code}
                                        onValueChange={(val) => form.setData('type_paid_code', val)}
                                        disabled={disable}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Tipe Pembayaran</SelectLabel>
                                                {typePaid.map((item, index) =>
                                                    <SelectItem key={index} value={item.ref_code}>{item.ref_value}</SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Unit<span className="text-destructive">*</span></FieldLabel>
                                    {type === 'detail' || type === 'update' ? (
                                        <Input
                                            name="unit"
                                            value={form.data.unit?.name || ''}
                                            className="w-full input"
                                            disabled={true}
                                        />
                                    ) : (
                                        <Combobox
                                            items={units}
                                            itemToStringLabel={(item : TUnit) => item.name}
                                            onValueChange={(val : TUnit | null) => form.setData('car_id', Number(val?.car_id))}
                                        >
                                            <ComboboxInput placeholder="Pilih Unit" showClear/>

                                            <ComboboxContent>
                                                <ComboboxEmpty>Unit tidak ditemukan.</ComboboxEmpty>

                                                <ComboboxList>
                                                    {(unit) => (
                                                        <ComboboxItem
                                                            key={unit.car_id}
                                                            value={unit}
                                                        >
                                                            {unit.name}
                                                            <Badge variant={unit.status.ref_code.toLowerCase()}>
                                                                {unit.status.ref_value}
                                                            </Badge>
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel>Status</FieldLabel>
                                    <Select
                                        value={form.data.status_code}
                                        onValueChange={(val) => form.setData('status_code', val)}
                                        disabled={disable}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                {status.map((item, index) =>
                                                    <SelectItem key={index} value={item.ref_code}>{item.ref_value}</SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </FieldGroup>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => router.get(indexOrder().url, {}, { preserveState: true, replace: true} )}
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
