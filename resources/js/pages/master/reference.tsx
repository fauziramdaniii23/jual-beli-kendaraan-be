import { router } from "@inertiajs/react";
import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    ArrowDownNarrowWide,
    ArrowUpDown,
    ArrowUpWideNarrow,
    MoreHorizontal, SquarePen, Trash
} from 'lucide-react';
import React, { useState } from 'react';
import { index as indexReference } from '@/actions/App/Http/Controllers/Master/MasterReferenceController';
import CreatereferenceDialog from '@/components/master/reference/add-reference';
import { ConfirmDeleteReference } from '@/components/master/reference/delete-confirm';
import UpdateReferenceDialog from '@/components/master/reference/update-reference';
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
import { MASTER_REFERENCE_LABEL } from '@/const/constant';
import AppLayout from '@/layouts/app-layout';
import type { TMasterReference } from '@/types';

type PageProps = {
    data_reference: TMasterReference[];
    type: keyof typeof MASTER_REFERENCE_LABEL;
};
export default function MasterReferencePage() {
    const { data_reference, type } = usePage<PageProps>().props;
    console.log(type);
    const label = MASTER_REFERENCE_LABEL[type];
    const [reference, setReference] = useState<TMasterReference>({
        ref_id: 0,
        ref_type: type,
        ref_code: '',
        ref_value: '',
        is_active: false,
    });
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectStatus, setSelectStatus] = useState<string>('all');
    const handleAction = (reference: TMasterReference, type: 'update' | 'delete') => {
        setReference(reference);

        if (type === 'update') {
            setIsUpdateDialogOpen(true);
        } else {
            setIsDeleteConfirmOpen(true);
        }
    };
    const submitFilter = () => {
        router.get(
            indexReference({type: type}).url,
            {
                status: selectStatus === 'all' ? undefined : selectStatus,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };
    const columns: ColumnDef<TMasterReference>[] = [
        {
            accessorKey: 'ref_code',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Kode {label}
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
            accessorKey: 'ref_value',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Nama {label}
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
                const reference = row.original;

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
                                    onClick={() => handleAction(reference, 'update')}
                                >
                                    <SquarePen /> Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleAction(reference, 'delete')}
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
            <Head title={label} />
            <div className="mx-4 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 w-full">
                    <span className="text-sm text-muted-foreground">
                        Status
                    </span>
                    <Select
                        value={selectStatus}
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
                <CreatereferenceDialog type={type} label={label}/>
            </div>
            <div className="m-4">
                <DataTable columns={columns} data={data_reference} />
            </div>
            <UpdateReferenceDialog label={label} reference={reference} isOpen={isUpdateDialogOpen} setIsOpen={(val) => setIsUpdateDialogOpen(val)} />
            <ConfirmDeleteReference label={label} ref_id={reference.ref_id} isOpen={isDeleteConfirmOpen} setIsOpen={setIsDeleteConfirmOpen}/>
        </>
    );
}

MasterReferencePage.layout = (page: React.ReactElement<PageProps>) => {
    const pageProps = (page.props as PageProps | undefined) ?? undefined;
    const breadcrumbTitle = pageProps?.type ? MASTER_REFERENCE_LABEL[pageProps.type] : '';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Master', href: '#' },
                { title: breadcrumbTitle, href: '#' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
