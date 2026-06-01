import { router } from "@inertiajs/react";
import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    Eye,
    MoreHorizontal, Trash
} from 'lucide-react';
import React, { useState } from 'react';
import { indexPermission, destroyRole } from '@/actions/App/Http/Controllers/Otentikasi/RoleAndPermissionController';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import Title from '@/components/app/title';
import CreateRoleDialog from '@/components/otentikasi/role-permission/add-role';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TRole = {
    id: number;
    name: string;
}

type PageProps = {
    roles: TRole[];
};

export default function MasterRolePage() {
    const { roles } = usePage<PageProps>().props;

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [roleId, setRoleId] = useState<number | null>(null);
    const handleActionDelete = (role: TRole) => {
        setRoleId(role.id);
        setIsDeleteConfirmOpen(true);
    };
    const handleActionDetail = (role: TRole) => {
        router.get(
            indexPermission(role.id).url,
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    }
    const handleDelete = () => {
        router.delete(destroyRole(roleId!).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteConfirmOpen(false);
            },
        });
    };

    const columns: ColumnDef<TRole>[] = [
        {
            accessorKey: 'name',
            header: 'Nama Role'
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
                const role = row.original;

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
                                    onClick={() => handleActionDetail(role)}
                                >
                                    <Eye /> Detail
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleActionDelete(role)}
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
            <Head title="Role" />
            <Title title="Daftar Role" description="Daftar Semua Role" />
            <div className="mx-4 mt-4">
                <CreateRoleDialog />
            </div>
            <div className="m-4">
                <DataTable columns={columns} data={roles} />
            </div>
            <ConfirmDialog
                confirmText="Hapus"
                title="Hapus Role"
                description="Apakah Anda yakin ingin menghapus Role ini? Tindakan
                        ini tidak dapat dibatalkan dan dapat memengaruhi data
                        user yang terkait dengan Role."
                open={isDeleteConfirmOpen}
                onOpenChange={setIsDeleteConfirmOpen}
                onConfirm={handleDelete}
            />
        </>
    );
}

MasterRolePage.layout = {
    breadcrumbs: [
        {
            title: 'Otentikasi',
        },
        {
            title: 'Role',
        },
    ],
};
