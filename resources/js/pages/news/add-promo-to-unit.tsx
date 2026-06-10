import { router } from '@inertiajs/react';
import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    ChevronDownIcon, Plus, Filter, ArrowUpDown, ArrowDownNarrowWide, ArrowUpWideNarrow
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { addPromoToUnit, index as indexPromo, storePromoToUnit } from '@/actions/App/Http/Controllers/News/PromoController';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import QuillContent from '@/components/app/quill-content';
import { SelectWithClear } from '@/components/app/select-with-clear';
import Title from '@/components/app/title';
import type { TStockUnitOptions, TUnit } from '@/components/inventory/stock-unit/type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DataTable } from '@/components/ui/data-table/data-table';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatRupiah } from '@/lib/utils';

type TPromo = {
    promo_id: number;
    name: string;
    code: string;
    type: string;
    description?: string;
    discount_value: number;
    start_date: string;
    end_date?: string;
    image?: string;
    is_active?: boolean;
}

type TPromoUnit = {
    car_id: number;
    name: string;
    price?: number | null;
    stnk_validity_period?: string | null;
    has_promo?: boolean;
    promo_names?: string;
    total_discount?: number;
    final_price?: number;
    promo_ids?: string[] | null;
    status_label?: string;
    status_code?: string;
}

type PageProps = {
    promo: TPromo;
    stock_unit: TUnit[];
    options: TStockUnitOptions;
};

export default function AddPromoToUnitPage() {
    const params = new URLSearchParams(window.location.search);
    const { promo, stock_unit, options } = usePage<PageProps>().props;
    const brandId = params.get('brand_id')?.toString();
    const branchId = params.get('branch_id')?.toString();
    const modelId = params.get('model_id')?.toString();
    const carType = params.get('car_type')?.toString();
    const transmissionId = params.get('transmission')?.toString();
    const fuelType = params.get('fuel_type')?.toString();
    const status = params.get('status')?.toString();

    const [promoUnit, setPromoUnit] = useState<TPromoUnit[]>(
        stock_unit.map((unit) => ({
            car_id: unit.car_id!,
            name: unit.name,
            price: unit.price!,
            stnk_validity_period: unit.stnk_validity_period,
            has_promo: unit.has_promo ?? false,
            promo_names: unit.promo_names,
            total_discount: unit.total_discount,
            final_price: unit.final_price!,
            promo_ids: unit.promo_ids!,
            status_label: unit.status?.ref_value,
            status_code: unit.status?.ref_code,
        }))
    );

    const [selectBrand, setSelectBrand] = useState<string>(brandId ?? '');
    const [selectBranch, setSelectBranch] = useState<string>(branchId ?? '');
    const [selectModel, setSelectModel] = useState<string>(modelId ?? '');
    const [selectCarType, setSelectCarType] = useState<string>(carType ?? '');
    const [selectTransmission, setSelectTransmission] = useState<string>(transmissionId ?? '');
    const [selectFuelType, setSelectFuelType] = useState<string>(fuelType ?? '');
    const [selectStatus, setSelectStatus] = useState<string>(status ?? '');
    const [deleteDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [availableChange, setAvailableChange] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);

    const filteredModels = useMemo(() => {
        return options.model.filter(
            (m) => !selectBrand || String(m.brand_id) === selectBrand
        );
    }, [options.model, selectBrand]);

    const submitFilter = () => {
        router.get(
            addPromoToUnit(promo.promo_id).url,
            {
                brand_id: selectBrand === '' ? undefined : selectBrand,
                branch_id: selectBranch === '' ? undefined : selectBranch,
                model_id: selectModel === '' ? undefined : selectModel,
                car_type: selectCarType === '' ? undefined : selectCarType,
                transmission: selectTransmission === '' ? undefined : selectTransmission,
                fuel_type: selectFuelType === '' ? undefined : selectFuelType,
                status: selectStatus === '' ? undefined : selectStatus,
            },
            {
                replace: true,
            }
        );
    };
    const handleBrandChange = (val: string) => {
        setSelectBrand(val);
        setSelectModel('');
    }
    const handleToggleActive =  (id: number, isActive: boolean) => {
        setAvailableChange(true);
        setPromoUnit((prev) =>
            prev.map((item) =>
                item.car_id === id
                    ? {
                        ...item,
                        has_promo: isActive,
                    }
                    : item
            )
        );
    };
    const handleToggleAll = async ( isActive: boolean) => {
        setAvailableChange(true);
        setPromoUnit((prev) =>
            prev.map((item) => ({
                ...item,
                has_promo: isActive,
            }))
        );
    };

    const selectAll = useMemo(
        () =>
            promoUnit.length > 0 &&
            promoUnit.every((item) => item.has_promo),
        [promoUnit]
    );

    const unSelectAll = useMemo(
        () =>
            promoUnit.length > 0 &&
            promoUnit.every((item) => !item.has_promo),
        [promoUnit]
    );

    const columns: ColumnDef<TPromoUnit>[] = [
        {
            id: 'has_promo',
            header: () => (
                <div className="items-center text-center min-w-10">
                    <Checkbox
                        checked={selectAll}
                        onCheckedChange={(checked) =>
                            handleToggleAll(Boolean(checked))
                        }
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="items-center text-center">
                    <Checkbox
                        checked={row.original.has_promo}
                        onCheckedChange={(checked) =>
                            handleToggleActive(
                                row.original.car_id,
                                Boolean(checked)
                            )
                        }
                    />
                </div>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Nama Unit'
        },
        {
            accessorKey: 'promo_names',
            header: 'Nama Promo'
        },
        {
            accessorKey: 'price',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Harga
                        {!sorted && <ArrowUpDown />}
                        {sorted === "asc" && <ArrowDownNarrowWide />}
                        {sorted === "desc" && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="items-center text-end">
                    {formatRupiah(row.getValue('price'))}
                </div>
            )
        },
        {
            accessorKey: 'total_discount',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Total Diskon
                        {!sorted && <ArrowUpDown />}
                        {sorted === "asc" && <ArrowDownNarrowWide />}
                        {sorted === "desc" && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="items-center text-end">
                    {formatRupiah(row.getValue('total_discount'))}
                </div>
            )
        },
        {
            accessorKey: 'final_price',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Harga Akhir
                        {!sorted && <ArrowUpDown />}
                        {sorted === "asc" && <ArrowDownNarrowWide />}
                        {sorted === "desc" && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="items-center text-end">
                    {formatRupiah(row.getValue('final_price'))}
                </div>
            )
        },
        {
            id: 'status',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Status
                        {!sorted && <ArrowUpDown />}
                        {sorted === "asc" && <ArrowDownNarrowWide />}
                        {sorted === "desc" && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const { status_label, status_code } = row.original;

                const variant = (status_code?.toLowerCase() ?? "default") as
                    | "available"
                    | "sold"
                    | "reserved"
                    | "repair";

                return (
                    <div className="text-center">
                        <Badge variant={variant}>
                            {status_label}
                        </Badge>
                    </div>
                );
            },
        }
    ];

    const handleSavePromoAction = () => {
        setLoad(true)
        router.post(storePromoToUnit(promo.promo_id!).url, {
            select_all: selectAll,
            un_select_all: unSelectAll,
            list_unit: promoUnit,
            brand_id: brandId,
            branch_id: branchId,
            model_id: modelId,
            car_type: carType,
            transmission: transmissionId,
            fuel_type: fuelType,
            status: status,
        },
        {
            preserveState: true,
            replace: true,
        })
    }

    return (
        <>
            <Head title="Terapkan Promo" />
            <Card className="m-4">
                <CardHeader className="text-lg font-semibold text-gray-800">
                    Detail Promo
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 w-full">
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel className="ml-2">Nama Promo</FieldLabel>
                                    <div className="w-full border border-gray-200 rounded-lg py-2 px-4">
                                        {promo.name}
                                    </div>

                                </Field>
                                <Field>
                                    <FieldLabel className="ml-2">Tipe Diskon</FieldLabel>
                                    <div className="w-full border border-gray-200 rounded-lg py-2 px-4">
                                        {promo.type === 'fixed' ? 'Fixed' : 'Persen'}
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel className="ml-2">Tanggal Mulai</FieldLabel>
                                    <div className="w-full border border-gray-200 rounded-lg py-2 px-4">
                                        {formatDate(promo.start_date)}
                                    </div>
                                </Field>
                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel className="ml-2">Kode Promo</FieldLabel>
                                    <div className="w-full border border-gray-200 rounded-lg py-2 px-4">
                                        {promo.code}
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel className="ml-2">Nilai Diskon</FieldLabel>
                                    <div className="w-full border border-gray-200 rounded-lg py-2 px-4">
                                        {promo.type === 'fixed' ? (
                                            formatRupiah(promo.discount_value)
                                        ) : (
                                            `${promo.discount_value} %`
                                        )}
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel className="ml-2">Tanggal Berakhir</FieldLabel>
                                    <div className="w-full border border-gray-200 rounded-lg py-2 px-4">
                                        {formatDate(promo.end_date)}
                                    </div>
                                </Field>
                            </FieldGroup>
                        </div>
                    </div>
                    <div className="mt-4 w-full border border-gray-200 rounded-lg py-2 px-4">
                        <Field>
                            <FieldLabel className="ml-2">Deskripsi</FieldLabel>
                            <QuillContent content={promo.description} />
                        </Field>
                    </div>
                </CardContent>
            </Card>
            <Title
                title={`Terapkan Promo ${promo.name}`}
                description="Pilih unit kendaraan yang akan mendapatkan promo ini. Unit yang dipilih akan terhubung dengan promo dan digunakan dalam perhitungan harga serta penawaran."
            />
            <div className="m-4 border rounded-md">
                <Collapsible defaultOpen className="rounded-md data-[state=open]:bg-muted">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="group w-full h-12">
                            <Filter /> Filter
                            <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
                        <form className="w-full" onSubmit={(e) => {
                            e.preventDefault();
                            submitFilter();
                        }}>
                            <Separator />
                            <div className="flex gap-4 w-full mt-4">
                                <div className="flex-1">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="">
                                                Merek
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Merek"
                                                value={selectBrand}
                                                onChange={handleBrandChange}
                                                items={options.brand}
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="">
                                                Cabang
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Cabang"
                                                value={selectBranch}
                                                onChange={(val) => setSelectBranch(val)}
                                                items={options.branch}
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="">
                                                Type
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Type"
                                                value={selectCarType}
                                                onChange={(val) => setSelectCarType(val)}
                                                items={options.car_type} />
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="">
                                                Transmisi
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Transmisi"
                                                value={selectTransmission}
                                                onChange={(val) => setSelectTransmission(val)}
                                                items={options.transmission} />
                                        </Field>
                                    </FieldGroup>
                                </div>

                                <div className="flex-1">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="">
                                                Model
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Model" value={selectModel}
                                                onChange={(val) => setSelectModel(val)}
                                                items={filteredModels.map(m => ({ label: m.label, value: String(m.value) }))} />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                                Bahan Bakar
                                            </FieldLabel>
                                            <SelectWithClear placeholder="Pilih Bahan Bakar" value={selectFuelType} onChange={(val) => setSelectFuelType(val)} items={options.fuel_type} />
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                                Status
                                            </FieldLabel>
                                            <SelectWithClear placeholder="Pilih Status" value={selectStatus} onChange={(val) => setSelectStatus(val)} items={options.status} />
                                        </Field>
                                    </FieldGroup>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <CollapsibleTrigger asChild>
                                    <Button type="button" variant="outline">
                                        Tutup
                                    </Button>
                                </CollapsibleTrigger>
                                <Button type="submit">Filter</Button>
                            </div>
                        </form>
                    </CollapsibleContent>
                </Collapsible>
            </div>

            <div className="mx-4">
                <Button disabled={promoUnit.length <= 0} onClick={() => setConfirmDialogOpen(true)}>
                    <Plus />
                    Terapkan Promo ke Unit Terpilih
                </Button>
            </div>
            <div className="m-4">
                <DataTable className="max-h-[600px]" showRowNumber={false} columns={columns} data={promoUnit} />
            </div>
            <ConfirmDialog
                title="Terapkan Promo"
                description={availableChange ? "Apakah Anda yakin ingin menerapkan Promo ini ke Unit terpilih?." : "Anda belum melakukan perubahan" }
                confirmText="Terapkan"
                open={deleteDialogOpen}
                onOpenChange={(val) => setConfirmDialogOpen(val)}
                onConfirm={handleSavePromoAction}
                disable={!availableChange}
                loading={load}
            />
        </>
    );
}

AddPromoToUnitPage.layout = {
    breadcrumbs: [
        {
            title: 'News',
        },
        {
            title: 'Promo',
            href: indexPromo()
        },
        {
            title: 'Terapkan Promo',
        }
    ],
};
