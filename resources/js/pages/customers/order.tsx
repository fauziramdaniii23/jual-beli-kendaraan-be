import { Head, router, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronDownIcon, Eye, Filter, MoreHorizontal, Plus, SquarePen, Star, Trash } from 'lucide-react';
import React from 'react';
import { index as indexOrder, form, destroy } from '@/actions/App/Http/Controllers/Customer/OrderController';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import Title from '@/components/app/title';
import type { TCustomer } from '@/components/customers/customer/type';
import type { TOrder } from '@/components/customers/orders/types';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DataTable } from '@/components/ui/data-table/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';

type PageProps = {
    orders: TOrder[];
    customers: TCustomer[];
}

export default function OrderPage() {
    const { orders, customers} = usePage<PageProps>().props;
    const [reviewId, setReviewId] = React.useState<number | null>(null);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

    const [selectedCustomers, setSelectedCustomers] = React.useState<TCustomer>();
    const handleAction = (order_id: number | undefined, type: 'detail' | 'create' | 'update' | 'delete') => {
        router.get(
            form().url,
            {
                order_id: order_id,
                type: type
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    }

    const submitFilter = () => {
        router.get(
            indexOrder().url,
            {
                customer_id: selectedCustomers?.customer_id,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };
    const handleDelete = () => {
        router.delete(destroy(reviewId!).url, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteConfirmOpen(false);
            },
        });
    };

    const handleConfirmDelete = (review: TOrder) => {
        setReviewId(review.order_id)
        setDeleteConfirmOpen(true);
    }

    const columns: ColumnDef<TOrder>[] = [
        {
            accessorKey: 'order_uuid',
            header: 'Nama Customer'
        },
        {
            id: 'actions',
            header: () => (
                <div className="text-center">
                    Aksi
                </div>
            ),
            enableHiding: false,
            cell: ({ row }) => {
                const order = row.original;

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
                                    onClick={() => handleAction(order.order_id, 'detail')}
                                >
                                    <Eye /> Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleAction(order.order_id, 'update')}
                                >
                                    <SquarePen /> Update
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleConfirmDelete(order)}
                                    className="text-red-500"
                                >
                                    <Trash className="text-red-500"/> Delete
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
            <Head title="Orders" />
            <Title title="Daftar Orders" description="Daftar Semua Order" />
            <div className="m-4 border rounded-md">
                <Collapsible className="rounded-md data-[state=open]:bg-muted">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="group w-full">
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

                                    </FieldGroup>
                                </div>

                                <div className="flex-1">
                                    <FieldGroup>

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
            <div className="mx-4 mt-4">
                <Button onClick={() => handleAction(undefined, 'create')}>
                    <Plus />
                    Tambah Order Baru
                </Button>
            </div>
            <div className="m-4">
                <DataTable columns={columns} data={orders} />
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
    )
}

OrderPage.layout = {
    breadcrumbs: [
        {
            title: 'Customer',
        },
        {
            title: 'Orders',
            href: indexOrder(),
        },
    ],
};
