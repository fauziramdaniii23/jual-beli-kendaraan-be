import { Head, router, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    ArrowDownNarrowWide,
    ArrowUpDown,
    ArrowUpWideNarrow,
    ChevronDownIcon,
    Eye,
    Filter,
    MoreHorizontal,
    Plus,
    SquarePen,
    Trash,
} from 'lucide-react';
import React, { useState } from 'react';
import {
    index as indexPO,
    form,
    destroy,
} from '@/actions/App/Http/Controllers/Customer/PreOrderController';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import { SelectWithClear } from '@/components/app/select-with-clear';
import Title from '@/components/app/title';
import type { TPreOrder } from '@/components/customers/pre-order/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { DataTable } from '@/components/ui/data-table/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { formatRibuan, formatRupiah } from '@/lib/utils';
import type { TMasterReference } from '@/types';

type PageProps = {
    preOrders: TPreOrder[];
    status: TMasterReference[];
};

export default function PreOrderPage() {
    const { preOrders, status } = usePage<PageProps>().props;
    const [preOrderId, setPreOrderId] = React.useState<number | null>(null);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

    const [statusCode, setStatusCode] = React.useState<string>('');
    const [year, setYear] = useState<string>('');

    const handleAction = (
        pre_order_id: number | undefined,
        type: 'detail' | 'create' | 'update' | 'delete',
    ) => {
        router.get(
            form().url,
            {
                pre_order_id: pre_order_id,
                type: type,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const submitFilter = () => {
        router.get(
            indexPO().url,
            {
                status_code: statusCode === '' ? undefined : statusCode,
                year: year === '' ? undefined : year,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };
    const handleDelete = () => {
        router.delete(destroy(preOrderId!).url, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteConfirmOpen(false);
            },
        });
    };

    const handleConfirmDelete = (po: TPreOrder) => {
        setPreOrderId(po.pre_order_id!);
        setDeleteConfirmOpen(true);
    };

    const columns: ColumnDef<TPreOrder>[] = [
        {
            accessorKey: 'customer.name',
            header: 'Nama Customer',
        },
        {
            accessorKey: 'brand',
            header: 'Merek',
        },
        {
            accessorKey: 'model',
            header: 'Model',
        },
        {
            accessorKey: 'variant',
            header: 'Varian',
        },
        {
            accessorKey: 'year',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Tahun
                        {!sorted && <ArrowUpDown />}
                        {sorted === 'asc' && <ArrowDownNarrowWide />}
                        {sorted === 'desc' && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
        },
        {
            accessorKey: 'kilometer',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Kilometer
                        {!sorted && <ArrowUpDown />}
                        {sorted === 'asc' && <ArrowDownNarrowWide />}
                        {sorted === 'desc' && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const val: string = row.getValue('kilometer');

                return formatRibuan(val);
            },
        },
        {
            accessorKey: 'expectation_price',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Harga Jual
                        {!sorted && <ArrowUpDown />}
                        {sorted === 'asc' && <ArrowDownNarrowWide />}
                        {sorted === 'desc' && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="w-full text-right">
                    {formatRupiah(row.getValue('expectation_price'))}
                </div>
            ),
        },
        {
            accessorKey: 'status.ref_value',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;

                return (
                    <div className="text-center">
                        <Badge variant="outline">{status?.ref_value}</Badge>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-center">Aksi</div>,
            enableHiding: false,
            cell: ({ row }) => {
                const po = row.original;

                return (
                    <div className="text-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleAction(po.pre_order_id, 'detail')
                                    }
                                >
                                    <Eye /> Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleAction(po.pre_order_id, 'update')
                                    }
                                >
                                    <SquarePen /> Update
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleConfirmDelete(po)}
                                    className="text-red-500"
                                >
                                    <Trash className="text-red-500" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Pengajuan Pre Order" />
            <Title
                title="Daftar Pengajuan Pre Order"
                description="Daftar Semua Unit yang diajukan Pengajuan Pre Order"
            />
            <div className="m-4 rounded-md border">
                <Collapsible className="rounded-md data-[state=open]:bg-muted">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="group w-full">
                            <Filter /> Filter
                            <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
                        <form
                            className="w-full"
                            onSubmit={(e) => {
                                e.preventDefault();
                                submitFilter();
                            }}
                        >
                            <Separator />
                            <div className="mt-4 flex w-full gap-4">
                                <div className="flex-1">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="">
                                                Status
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Status"
                                                value={statusCode}
                                                onChange={(val) =>
                                                    setStatusCode(val)
                                                }
                                                items={status.map((item) => ({
                                                    label: item.ref_value,
                                                    value: item.ref_code,
                                                }))}
                                            />
                                        </Field>
                                    </FieldGroup>
                                </div>

                                <div className="flex-1">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel>Tahun</FieldLabel>
                                            <Input
                                                value={year}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                        .replace(/\D/g, '')
                                                        .slice(0, 4);
                                                    setYear(value);
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={4}
                                            />
                                        </Field>
                                    </FieldGroup>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
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
            <div className="mx-4 mt-4">
                <Button onClick={() => handleAction(undefined, 'create')}>
                    <Plus />
                    Tambah Data Pre Order
                </Button>
            </div>
            <div className="m-4">
                <DataTable columns={columns} data={preOrders} />
            </div>
            <ConfirmDialog
                confirmText="Hapus"
                title="Hapus Order"
                description="Apakah Anda yakin ingin menghapus Order ini?"
                open={isDeleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleDelete}
            />
        </>
    );
}

PreOrderPage.layout = {
    breadcrumbs: [
        {
            title: 'Customer',
        },
        {
            title: 'PreOrder',
            href: indexPO(),
        },
    ],
};
