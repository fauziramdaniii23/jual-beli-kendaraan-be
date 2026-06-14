import { Head, router, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    ArrowDownNarrowWide,
    ArrowUpDown, ArrowUpWideNarrow,
    ChevronDownIcon,
    Eye,
    Filter,
    MoreHorizontal,
    Plus,
    SquarePen,
    Trash
} from 'lucide-react';
import React from 'react';
import { index as indexOrder, form, destroy } from '@/actions/App/Http/Controllers/Customer/OrderController';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import Title from '@/components/app/title';
import type { TOrder } from '@/components/customers/orders/types';
import { Badge } from '@/components/ui/badge';
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';
import type { TMasterReference } from '@/types';
import { SelectWithClear } from '@/components/app/select-with-clear';

type PageProps = {
    orders: TOrder[];
    status: TMasterReference[];
    typePaid: TMasterReference[];
}

export default function OrderPage() {
    const { orders, status, typePaid} = usePage<PageProps>().props;
    const [reviewId, setReviewId] = React.useState<number | null>(null);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

    const [statusCode, setStatusCode] = React.useState<string>('');
    const [typePaidCode, setTypePaidCode] = React.useState<string>('')
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
                status_code: statusCode === '' ? undefined : statusCode,
                type_paid: typePaidCode === '' ? undefined : typePaidCode,
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
            header: 'Order ID',
        },
        {
            accessorKey: 'customer.name',
            header: 'Nama Customer',
        },
        {
            accessorKey: 'unit.name',
            header: 'Unit',
        },
        {
            accessorKey: 'status.ref_value',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;

                return (
                    <div className="text-center">
                        <Badge variant="outline">
                            {status?.ref_value}
                        </Badge>
                    </div>
                );
            },
        },
        {
          accessorKey: 'type_paid.ref_value',
          header: 'Tipe Pembayaran',
        },
        {
            accessorKey: 'updated_at',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Update Terbaru
                        {!sorted && <ArrowUpDown />}
                        {sorted === "asc" && <ArrowDownNarrowWide />}
                        {sorted === "desc" && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
            cell: ({row}) => {
                const date = row.getValue('updated_at');

                return formatDate(date)
            }
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
                                        <Field>
                                            <FieldLabel htmlFor="">
                                                Status
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Status"
                                                value={statusCode}
                                                onChange={(val) => setStatusCode(val)}
                                                items={status.map((item) => ({label: item.ref_value, value: item.ref_code}))}
                                            />
                                        </Field>
                                    </FieldGroup>
                                </div>

                                <div className="flex-1">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="">
                                                Tipe Pembayaran
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Tipe Pembayaran"
                                                value={typePaidCode}
                                                onChange={(val) => setTypePaidCode(val)}
                                                items={typePaid.map((item) => ({label: item.ref_value, value: item.ref_code}))}
                                            />
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
