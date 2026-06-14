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
import { index as indexTestDrive, form, destroy } from '@/actions/App/Http/Controllers/Customer/TestDriveController';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import { SelectWithClear } from '@/components/app/select-with-clear';
import Title from '@/components/app/title';
import type { TCustomer } from '@/components/customers/customer/type';
import type { TUnit } from '@/components/inventory/stock-unit/type';
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
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';
import type { TMasterReference } from '@/types';

type TTestDrive = {
    test_drive_id: number
    car_id: number
    customer_id: number
    branch_id: number
    status_code: string;
    test_drive_date: string;
    unit?: TUnit;
    customer?: TCustomer;
    status?: TMasterReference;
    branch?: {
        branch_id: number
        name: string
    };
}

type PageProps = {
    testDrives: TTestDrive[];
    status: TMasterReference[];
    branch: {
        branch_id: number
        name: string
    }[];
}

export default function TestDrivePage() {
    const { testDrives, status, branch} = usePage<PageProps>().props;
    const [testDriveId, setTestDriveId] = React.useState<number | null>(null);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

    console.log(testDrives);

    const [statusCode, setStatusCode] = React.useState<string>('');
    const [branchId, setBranchId] = React.useState<string>('')
    const handleAction = (test_drive_id: number | undefined, type: 'detail' | 'create' | 'update' | 'delete') => {
        router.get(
            form().url,
            {
                test_drive_id: test_drive_id,
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
            indexTestDrive().url,
            {
                status_code: statusCode === '' ? undefined : statusCode,
                branch_id: branchId === '' ? undefined : branchId,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };
    const handleDelete = () => {
        router.delete(destroy(testDriveId!).url, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteConfirmOpen(false);
            },
        });
    };

    const handleConfirmDelete = (drive: TTestDrive) => {
        setTestDriveId(drive.test_drive_id)
        setDeleteConfirmOpen(true);
    }

    const columns: ColumnDef<TTestDrive>[] = [
        {
            accessorKey: 'customer.name',
            header: 'Nama Customer',
        },
        {
            accessorKey: 'unit.name',
            header: 'Unit',
        },
        {
            accessorKey: 'branch.name',
            header: 'Cabang',
        },
        {
            accessorKey: 'date',
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
                        {sorted === "asc" && <ArrowDownNarrowWide />}
                        {sorted === "desc" && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const date = row.getValue('date');

                return (formatDate(date) as string) || '';
            }
        },

        {
            accessorKey: 'time',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Jam
                        {!sorted && <ArrowUpDown />}
                        {sorted === "asc" && <ArrowDownNarrowWide />}
                        {sorted === "desc" && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
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
            id: 'actions',
            header: () => (
                <div className="text-center">
                    Aksi
                </div>
            ),
            enableHiding: false,
            cell: ({ row }) => {
                const drive = row.original;

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
                                    onClick={() => handleAction(drive.test_drive_id, 'detail')}
                                >
                                    <Eye /> Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleAction(drive.test_drive_id, 'update')}
                                >
                                    <SquarePen /> Update
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleConfirmDelete(drive)}
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
            <Head title="Test Drive" />
            <Title title="Daftar Test Drive" description="Daftar Semua Jadwal Test Drive" />
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
                                                Cabang
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Cabang"
                                                value={branchId}
                                                onChange={(val) => setBranchId(val)}
                                                items={branch.map((item) => ({label: item.name, value: item.branch_id.toString()}))}
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
                <DataTable columns={columns} data={testDrives} />
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

TestDrivePage.layout = {
    breadcrumbs: [
        {
            title: 'Customer',
        },
        {
            title: 'Test Drive',
            href: indexTestDrive(),
        },
    ],
};
