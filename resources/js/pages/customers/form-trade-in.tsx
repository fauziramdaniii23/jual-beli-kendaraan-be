import { Head, router, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import {
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/Customer/TradeInController';
import DatePicker from '@/components/app/date-picker';
import Title from '@/components/app/title';
import { defaultTradeIn } from '@/components/customers/orders/types';
import type { TOrder, TTradeIn } from '@/components/customers/orders/types';
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
import { formatRibuan } from '@/lib/utils';
import type { TMasterReference } from '@/types';

type PageProps = {
    tradeIn: TTradeIn;
    orders: TOrder[];
    status: TMasterReference[];
    order: TOrder;
    type: 'detail' | 'create' | 'update';
};

export default function FormTradeInPage() {
    const { tradeIn, orders, status, type, order } = usePage<PageProps>().props;
    const label = TYPE_LABEL[type];
    const form = useForm<TTradeIn>(tradeIn ?? defaultTradeIn);
    const disable = type === 'detail';

    const selectedOrder = orders.find((o) => o.order_id === tradeIn?.order_id);

    const [unitName, setUnitName] = React.useState<string>(
        selectedOrder?.unit?.name ?? '',
    );

    const handleChangeOrderOptions = (order: TOrder) => {
        if (!order) {
            setUnitName('');
            form.setData('order_id', undefined);

            return;
        }

        setUnitName(order.unit!.name);
        form.setData('order_id', order.order_id);
        form.setData('car_id', order.unit!.car_id);
    };
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url =
            type === 'update' && tradeIn
                ? update(tradeIn.trade_in_id!).url
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
            <Head title={`${label} Data Tukar Tambah`} />
            <Title
                title={`${label} Data Tukar Tambah`}
                description={`Form ${label} Data Tukar Tambah`}
            />
            <div className="m-4">
                <form onSubmit={submit} className="space-y-4">
                    <div className="mt-4 flex w-full gap-4">
                        <div className="flex-1">
                            <FieldGroup>
                                {type === 'create' && (
                                    <Field>
                                        <FieldLabel>
                                            Order ID
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FieldLabel>

                                        <Combobox
                                            items={orders}
                                            itemToStringLabel={(item: TOrder) =>
                                                `${item.order_uuid} - ${item.customer?.name}`
                                            }
                                            onValueChange={(
                                                val: TOrder | null,
                                            ) => handleChangeOrderOptions(val!)}
                                        >
                                            <ComboboxInput
                                                placeholder="Pilih Order"
                                                showClear
                                            />

                                            <ComboboxContent>
                                                <ComboboxEmpty>
                                                    Order tidak ditemukan
                                                </ComboboxEmpty>

                                                <ComboboxList>
                                                    {(order) => (
                                                        <ComboboxItem
                                                            key={order.order_id}
                                                            value={order}
                                                        >
                                                            {order.order_uuid} -{' '}
                                                            {
                                                                order.customer
                                                                    .name
                                                            }
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                    </Field>
                                )}
                                <Field>
                                    <FieldLabel>
                                        Merek
                                        <span className="text-destructive">
                                            *
                                        </span>
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
                                    <FieldLabel>
                                        Varian
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FieldLabel>
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
                                    <FieldLabel>
                                        Tahun
                                        <span className="text-red-600">*</span>
                                    </FieldLabel>
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
                                <Field>
                                    <FieldLabel>Tanggal Inspeksi</FieldLabel>
                                    <DatePicker
                                        value={form.data.inspection_date || ''}
                                        onChange={(val) =>
                                            form.setData('inspection_date', val)
                                        }
                                        invalid={!!form.errors.inspection_date}
                                        disabled={disable}
                                    />
                                    {form.errors.inspection_date && (
                                        <div className="text-sm text-destructive">
                                            {form.errors.inspection_date}
                                        </div>
                                    )}
                                </Field>
                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>
                                {type === 'create' && (
                                    <Field>
                                        <FieldLabel>
                                            Nama Unit
                                            <span className="text-xs text-slate-600 italic">
                                                (Pilih Order)
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            value={unitName}
                                            className="input w-full"
                                            disabled={true}
                                        />
                                    </Field>
                                )}
                                <Field>
                                    <FieldLabel>
                                        Model
                                        <span className="text-destructive">
                                            *
                                        </span>
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
                                <Field>
                                    <FieldLabel>
                                        Kilometer(KM)
                                        <span className="text-red-600">*</span>
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
                            Detail Order
                        </CardHeader>
                        <CardContent>
                            <div className="flex w-full gap-4">
                                <div className="flex-1">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel>Order ID</FieldLabel>
                                            <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                {order.order_uuid}
                                            </div>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Tahun</FieldLabel>
                                            <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                {order.unit?.year}
                                            </div>
                                        </Field>
                                        <Field>
                                            <FieldLabel>
                                                Nama Customer
                                            </FieldLabel>
                                            <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                {order.customer?.name}
                                            </div>
                                        </Field>
                                    </FieldGroup>
                                </div>
                                <div className="flex-1">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel>Unit</FieldLabel>
                                            <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                {order.unit?.name}
                                            </div>
                                        </Field>
                                        <Field>
                                            <FieldLabel>
                                                Kilometer(KM)
                                            </FieldLabel>
                                            <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                {formatRibuan(
                                                    order.unit?.kilometer ?? 0,
                                                )}
                                            </div>
                                        </Field>
                                        <Field>
                                            <FieldLabel>
                                                No Handphone
                                            </FieldLabel>
                                            <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                +{order.customer?.phone}
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

FormTradeInPage.layout = (page: React.ReactElement<PageProps>) => {
    const pageProps = (page.props as PageProps | undefined) ?? undefined;
    const breadcrumbTitle = pageProps?.type ? TYPE_LABEL[pageProps?.type] : '';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Customer', href: '#' },
                { title: 'Tukar Tambah', href: index() },
                { title: `${breadcrumbTitle} Data Tukar Tambah`, href: '#' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
