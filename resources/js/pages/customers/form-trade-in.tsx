import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
import { index, store, update } from '@/actions/App/Http/Controllers/Customer/TradeInController';
import DatePicker from '@/components/app/date-picker';
import { SelectWithClear } from '@/components/app/select-with-clear';
import Title from '@/components/app/title';
import {
    defaultTradeIn
} from '@/components/customers/orders/types';
import type {TOrder, TTradeIn} from '@/components/customers/orders/types';
import type { TOptionItemModel } from '@/components/inventory/stock-unit/type';
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
import { NumberFormatInput } from '@/components/ui/number-format-input';
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
import type { TMasterReference, TOptionItem } from '@/types';

type PageProps = {
    tradeIn: TTradeIn;
    orders: TOrder[];
    brands: TOptionItem[];
    models: TOptionItemModel[];
    status: TMasterReference[];
    type: 'detail' | 'create' | 'update';
};

export default function FormTradeInPage() {
    const { tradeIn, orders, brands, models, status, type, } = usePage<PageProps>().props;
    const label = TYPE_LABEL[type];
    const form = useForm<TTradeIn>(tradeIn ?? defaultTradeIn);
    const disable = type === 'detail';

    const selectedOrder = orders.find(
        (o) => o.order_id === tradeIn?.order_id
    );

    const [unitName, setUnitName] = React.useState<string>(
        selectedOrder?.unit?.name ?? ''
    );

    const [customerName, setCustomerName] = React.useState<string>(
        selectedOrder?.customer?.name ?? ''
    );

    const handleBrandChange = (val: string) => {
        form.setData(
            'brand_id',
            val === '' ? (undefined as any) : (val as any),
        );
        form.setData('model_id', undefined); // reset model when brand changes
    };

    const filteredModels = useMemo(() => {
        return models.filter((m) => !form.data.brand_id || String(m.brand_id) === String(form.data.brand_id));
    }, [models, form.data.brand_id]);

    const handleChangeOrderOptions = (order: TOrder) => {
        if(!order) {
            setUnitName("")
            setCustomerName("")
            form.setData('order_id', undefined);

            return;
        }

        setUnitName(order.unit!.name)
        setCustomerName(order.customer!.name)
        form.setData('order_id', order.order_id)
        form.setData('car_id', order.unit!.car_id)
    }
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = type === 'update' && tradeIn ? update(tradeIn.trade_in_id!).url : store.url();

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
                                <Field>
                                    <FieldLabel>
                                        Order ID
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FieldLabel>
                                    {type === 'detail' || type === 'update' ? (
                                        <Input
                                            name="Order ID"
                                            value={selectedOrder?.order_uuid}
                                            className="input w-full"
                                            disabled={true}
                                        />
                                    ) : (
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
                                    )}
                                </Field>
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
                                <Field>
                                    <FieldLabel>
                                        Merek
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FieldLabel>
                                    <SelectWithClear
                                        placeholder="Pilih Merek"
                                        value={String(form.data.brand_id ?? '')}
                                        onChange={handleBrandChange}
                                        items={brands}
                                        invalid={!!form.errors.brand_id}
                                        disabled={disable}
                                    />
                                    {form.errors.brand_id && (
                                        <div className="text-sm text-destructive">
                                            {form.errors.brand_id}
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
                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>
                                        Nama Customer
                                        <span className="text-xs text-slate-600 italic">
                                            (Pilih Order)
                                        </span>
                                    </FieldLabel>
                                    <Input
                                        value={customerName}
                                        className="input w-full"
                                        disabled={true}
                                    />
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
                                        Model
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FieldLabel>
                                    <SelectWithClear
                                        name="model"
                                        placeholder="Pilih Model"
                                        value={String(form.data.model_id ?? '')}
                                        onChange={(val) =>
                                            form.setData(
                                                'model_id',
                                                val === ''
                                                    ? (undefined as any)
                                                    : (val as any),
                                            )
                                        }
                                        items={filteredModels.map((m) => ({
                                            label: m.label,
                                            value: String(m.value),
                                        }))}
                                        invalid={!!form.errors.model_id}
                                        disabled={disable}
                                    />
                                    {form.errors.model_id && (
                                        <div className="text-sm text-destructive">
                                            {form.errors.model_id}
                                        </div>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        Kilometer(KM)
                                        <span className="text-red-600">*</span>
                                    </FieldLabel>
                                    <NumberFormatInput
                                        value={form.data.kilometer}
                                        onChange={(e) => form.setData('kilometer', e)}
                                        disable={disable}
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
