import { router } from "@inertiajs/react";
import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    ArrowDownNarrowWide,
    ArrowUpDown,
    ArrowUpWideNarrow,
    MoreHorizontal, SquarePen, Trash,
} from 'lucide-react';
import React, { useState } from 'react';
import { index as indexCustomer } from '@/actions/App/Http/Controllers/Customer/CustomerController';
import Title from '@/components/app/title';
import CreateCstomerDialog from '@/components/customers/customer/add-customer';
import { ConfirmDeleteCustomer } from '@/components/customers/customer/delete-customer';
import type { TCustomer } from '@/components/customers/customer/type';
import UpdateCustomerDialog from '@/components/customers/customer/update-customer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem, SelectSeparator,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

type PageProps = {
    customers: TCustomer[];
};

export default function CustomerPage() {
    const { customers } = usePage<PageProps>().props;
    console.log(customers);
    const [customer, seTCustomer] = useState<TCustomer>({
        customer_id: 0,
        name: '',
        email: '',
        phone: '',
    });
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectStatus, setSelectStatus] = useState<string>('all');

    const handleAction = (customer: TCustomer, type: 'update' | 'delete') => {
        seTCustomer(customer);

        if (type === 'update') {
            setIsUpdateDialogOpen(true);
        } else {
            setIsDeleteConfirmOpen(true);
        }
    };
    const submitFilter = () => {
        router.get(
            indexCustomer().url,
            {
                status: selectStatus === "all" ? undefined : selectStatus,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const columns: ColumnDef<TCustomer>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Nama Customer
                        {/* NONE */}
                        {!sorted && <ArrowUpDown />}
                        {/* ASC */}
                        {sorted === 'asc' && <ArrowDownNarrowWide />}
                        {/* DESC */}
                        {sorted === 'desc' && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
        },
        {
            accessorKey: 'phone',
            header: 'No Handphone'
        },
        {
            accessorKey: 'email',
            header: 'Email'
        },
        {
            accessorKey: 'is_active',
            header: () => (
                <div className="text-center">
                    Status
                </div>
            ),
            cell: ({ row }) => {
                const isActive = row.getValue('is_active') as boolean;

                return (
                    <div className="text-center">
                        <Badge
                            variant={isActive ? "success" : "destructive"}
                        >
                            {isActive ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                    </div>
                );
            },
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
                const model : TCustomer = row.original;

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
                                    onClick={() => handleAction(model, 'update')}
                                >
                                    <SquarePen /> Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleAction(model, 'delete')}
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
            <Head title="Customer" />
            <Title title="Daftar Customer" description="Daftar Semua Customer" />
            <div className="mx-4 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 w-full">
                    <span className="text-sm text-muted-foreground">
                        Status
                    </span>
                    <Select
                        onValueChange={(val) => setSelectStatus(val as string)}
                    >
                        <SelectTrigger className="w-full max-w-48">
                            <SelectValue placeholder="Semua"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">Semua</SelectItem>
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                                <SelectItem value="true">Aktif</SelectItem>
                                <SelectItem value="false">Tidak Aktif</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button onClick={submitFilter}>
                        Filter
                    </Button>
                </div>
                <CreateCstomerDialog />
            </div>
            <div className="m-4">
                <DataTable columns={columns} data={customers} />
            </div>
            <UpdateCustomerDialog customer={customer} isOpen={isUpdateDialogOpen} setIsOpen={(val) => setIsUpdateDialogOpen(val)} />
            <ConfirmDeleteCustomer customer_id={customer.customer_id} isOpen={isDeleteConfirmOpen} setIsOpen={setIsDeleteConfirmOpen}/>
        </>
    );
}

CustomerPage.layout = {
    breadcrumbs: [
        {
            title: 'Master',
        },
        {
            title: 'model',
        },
    ],
};
