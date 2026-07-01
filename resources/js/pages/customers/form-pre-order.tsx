import { Head, router, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import {
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/Customer/PreOrderController';
import Title from '@/components/app/title';
import type { TCustomer } from '@/components/customers/customer/type';
import type { TPreOrder} from '@/components/customers/pre-order/types';
import { defaultPreOrder } from '@/components/customers/pre-order/types';
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
import { Input } from '@/components/ui/input';
import { NumberFormatInput } from '@/components/ui/number-format-input';
import { InputGroupNumberFormat } from '@/components/ui/number-format-inputgroup';
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
import type { TMasterReference } from '@/types';

type PageProps = {
    po: TPreOrder;
    customers: TCustomer[];
    status: TMasterReference[];
    type: 'detail' | 'create' | 'update';
};

export default function FormPreOrderPage() {
    const { po, status, type, customers } = usePage<PageProps>().props;
    const label = TYPE_LABEL[type];
    const form = useForm<TPreOrder>(po ?? defaultPreOrder);
    const disable = type === 'detail';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url =
            type === 'update' && po
                ? update(po.pre_order_id!).url
                : store.url();

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
            <Head title={`${label} Data Pre Order`} />
            <Title
                title={`${label} Data Pre Order`}
                description={`Form ${label} Data Pre Order`}
            />
            <div className="m-4">
                <form onSubmit={submit} className="space-y-4">
                    <div className="mt-4 flex w-full gap-4">
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Nama Customer<span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Combobox
                                        defaultValue={form.data.customer}
                                        disabled={disable || type === 'update'}
                                        items={customers}
                                        itemToStringLabel={(item: TCustomer) =>
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
                                            disabled={
                                                disable || type === 'update'
                                            }
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
                                                            (+{customer.phone})
                                                        </span>
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        Model<span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input
                                        name="name"
                                        value={form.data.model || ''}
                                        onChange={(e) =>
                                            form.setData(
                                                'model',
                                                e.target.value,
                                            )
                                        }
                                        className="input w-full"
                                        aria-invalid={!!form.errors.model}
                                        disabled={disable}
                                    />
                                    {form.errors.model && (
                                        <div className="text-sm text-destructive">
                                            {form.errors.model}
                                        </div>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel>Varian<span className="text-destructive">*</span></FieldLabel>
                                    <Input
                                        name="name"
                                        value={form.data.variant || ''}
                                        onChange={(e) =>
                                            form.setData(
                                                'variant',
                                                e.target.value,
                                            )
                                        }
                                        className="input w-full"
                                        aria-invalid={!!form.errors.variant}
                                        disabled={disable}
                                    />
                                    {form.errors.variant && (
                                        <div className="text-sm text-destructive">
                                            {form.errors.variant}
                                        </div>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel> Tahun <span className="text-red-600">*</span></FieldLabel>
                                    <Input
                                        value={form.data.year}
                                        onChange={(e) => {
                                            const value = e.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 4);
                                            form.setData('year', Number(value));
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={4}
                                        disabled={disable}
                                        required
                                    />
                                </Field>
                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>
                                        Merek<span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input
                                        name="name"
                                        value={form.data.brand || ''}
                                        onChange={(e) =>
                                            form.setData(
                                                'brand',
                                                e.target.value,
                                            )
                                        }
                                        className="input w-full"
                                        aria-invalid={!!form.errors.brand}
                                        disabled={disable}
                                    />
                                    {form.errors.brand && (
                                        <div className="text-sm text-destructive">
                                            {form.errors.brand}
                                        </div>
                                    )}
                                </Field>
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
                                                {status.map((item) => (
                                                    <SelectItem
                                                        key={item.ref_code}
                                                        value={item.ref_code}
                                                    >
                                                        {item.ref_value}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        Kilometer(KM)<span className="text-red-600">*</span>
                                    </FieldLabel>
                                    <NumberFormatInput
                                        value={form.data.kilometer}
                                        onChange={(e) =>
                                            form.setData('kilometer', e)
                                        }
                                        disable={disable}
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Ekspektasi Harga</FieldLabel>
                                    <InputGroupNumberFormat
                                        value={form.data.expectation_price}
                                        onChange={(value) =>
                                            form.setData('expectation_price', value)
                                        }
                                        disable={disable}
                                        className="input w-full"
                                        invalid={!!form.errors.expectation_price}
                                    />
                                    {form.errors.expectation_price && (
                                        <div className="text-sm text-destructive">
                                            {form.errors.expectation_price}
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
                {(type === 'detail' || type === 'update') && (
                    <Card className="my-4">
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
                                                {form.data.customer?.email ??
                                                    '-'}
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
                                                {form.data.customer?.phone ??
                                                    '-'}
                                            </div>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Alamat</FieldLabel>
                                            <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                {form.data.customer?.address ??
                                                    '-'}
                                            </div>
                                        </Field>
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

FormPreOrderPage.layout = (page: React.ReactElement<PageProps>) => {
    const pageProps = (page.props as PageProps | undefined) ?? undefined;
    const breadcrumbTitle = pageProps?.type ? TYPE_LABEL[pageProps?.type] : '';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Customer', href: '#' },
                { title: 'Pre Order', href: index() },
                { title: `${breadcrumbTitle} Data Pre Order`, href: '#' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
