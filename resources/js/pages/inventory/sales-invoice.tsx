import { Head, usePage, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    ChevronDownIcon,
    Plus,
    Filter,
    ArrowUpDown,
    ArrowDownNarrowWide,
    ArrowUpWideNarrow,
    MoreHorizontal,
    Eye,
    SquarePen,
    Trash,
} from 'lucide-react';
import React, { useState } from 'react';
import {
    create,
    destroy,
} from '@/actions/App/Http/Controllers/inventory/SalesInvoiceController';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import Title from '@/components/app/title';
import type { TSalesInvoice } from '@/components/inventory/sales-invoice/type';
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
import { Separator } from '@/components/ui/separator';

type PageProps = {
    sales_invoice: TSalesInvoice[];
};

export default function SalesInvoicePage() {
    const { sales_invoice } = usePage<PageProps>().props;

    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    const handleAddStockUnit = () => {
        router.get(
            create().url,
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const columns: ColumnDef<TSalesInvoice>[] = [
        {
            accessorKey: 'customer.name',
            header: 'Nama Customer',
        },
        {
            accessorKey: 'unit.name',
            header: 'Nama Unit',
        },
        {
            accessorKey: 'final_price',
            header: 'Harga',
        },
        {
            accessorKey: 'invoice_date',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Tanggal
                        {!sorted && <ArrowUpDown />}
                        {sorted === 'asc' && <ArrowDownNarrowWide />}
                        {sorted === 'desc' && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-center">Aksi</div>,
            enableHiding: false,
            cell: ({ row }) => {
                const invoice = row.original;

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
                                    onClick={() => console.log('detail')}
                                >
                                    <Eye /> Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => console.log('update')}
                                >
                                    <SquarePen /> Update
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => console.log('delete')}
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

    const [deleteLoading, setDeleteLoading] = useState(false);
    const handleDeleteAction = () => {
        router.delete(destroy(0).url, {
            preserveState: true,
            replace: true,
            onStart: () => {
                setDeleteLoading(false);
            },
        });
    };

    return (
        <>
            <Head title="Faktur Penjualan" />
            <Title
                title="Daftar Faktur Penjualan"
                description="Daftar Semua Faktur Penjualan"
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
                                console.log('filter');
                            }}
                        >
                            <Separator />
                            <div className="mt-4 flex w-full gap-4">
                                <div className="flex-1">Filter 1</div>

                                <div className="flex-1">Filter 2</div>
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

            <div className="mx-4">
                <Button onClick={handleAddStockUnit}>
                    <Plus />
                    Tambah Faktur Penjualan Baru
                </Button>
            </div>
            <div className="m-4">
                <DataTable
                    className="max-h-150"
                    columns={columns}
                    data={sales_invoice}
                />
            </div>
            <ConfirmDialog
                title="Hapus Faktur Penjualan"
                description="Apakah Anda yakin ingin menghapus Faktur Penjualan ini? Tindakan ini tidak dapat dibatalkan dan dapat memengaruhi data yang terkait dengan Faktur Penjualan."
                confirmText="Hapus"
                open={deleteDialogOpen}
                onOpenChange={(val) => setDeleteDialogOpen(val)}
                onConfirm={handleDeleteAction}
                loading={deleteLoading}
            />
        </>
    );
}

SalesInvoicePage.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
        },
        {
            title: 'Faktur Penjualan',
        },
    ],
};
