import { Head, router, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { index, store, update } from '@/actions/App/Http/Controllers/Customer/TestDriveController';
import DatePicker from '@/components/app/date-picker';
import { TimePicker } from '@/components/app/time-picker';
import Title from '@/components/app/title';
import type { TCustomer } from '@/components/customers/customer/type';
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

type TFormTestDrive = {
    test_drive_id?: number;
    car_id: number;
    customer_id: number;
    branch_id: string;
    status_code: string;
    date: string;
    time: string;
    unit?: TUnit;
    customer?: TCustomer;
    status?: TMasterReference;
    branch?: {
        branch_id: string;
        name: string;
    };
}
const defaultTestDrive = {
    test_drive_id: 0,
    car_id: 0,
    customer_id: 0,
    branch_id: '',
    status_code: '',
    date: '',
    time: '',
}
type PageProps = {
    testDrive?: TFormTestDrive;
    customers: TCustomer[];
    units: TUnit[];
    status: TMasterReference[];
    branch: {
        branch_id: number
        name: string
    }[];
    type: 'detail' | 'create' | 'update';
};

export default function FormTestDrivePage() {
    const { testDrive, customers, units, status, branch, type, } = usePage<PageProps>().props;
    const label = TYPE_LABEL[type];
    const form = useForm<TFormTestDrive>(testDrive ?? defaultTestDrive);
    const disable = type === 'detail';

    console.log(testDrive);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = type === 'update' && testDrive ? update(testDrive.test_drive_id!).url : store.url();

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
            <Head title={`${label} Test Drive`} />
            <Title title={`${label} Test Drive`} description={`Form ${label} Test Drive`} />
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
                                                    {(user) => (
                                                        <ComboboxItem
                                                            key={user.id}
                                                            value={user}
                                                        >
                                                            {user.name}
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel>Tanggal</FieldLabel>
                                    <DatePicker
                                        value={form.data.date}
                                        onChange={(val) => form.setData('date', val)}
                                        disabled={disable}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Cabang Showroom</FieldLabel>
                                    <Select
                                        value={form.data.branch_id.toString()}
                                        onValueChange={(val) => form.setData('branch_id', val)}
                                        disabled={disable}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Cabang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Cabang</SelectLabel>
                                                {branch.map((item, index) =>
                                                    <SelectItem key={index} value={item.branch_id.toString()}>{item.name}</SelectItem>
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
                                    <FieldLabel>Jam</FieldLabel>
                                    <TimePicker
                                        value={form.data.time}
                                        onChange={(val) => form.setData('time', val)}
                                        disabled={disable}
                                    />
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
                            onClick={() => router.get(index().url, {}, { preserveState: true, replace: true} )}
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

FormTestDrivePage.layout = (page: React.ReactElement<PageProps>) => {
    const pageProps = (page.props as PageProps | undefined) ?? undefined;
    const breadcrumbTitle = pageProps?.type ? TYPE_LABEL[pageProps?.type] : '';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Inventory', href: '#' },
                { title: 'Stock Unit', href: index() },
                { title: `${breadcrumbTitle} Unit`, href: '#' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
