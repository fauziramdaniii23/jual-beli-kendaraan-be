import { router } from "@inertiajs/react";
import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    Eye,
    MoreHorizontal, Plus, SquarePen, Trash
} from 'lucide-react';
import React, { useState } from 'react';
import { destroy as deleteUser, formUser } from '@/actions/App/Http/Controllers/Otentikasi/UserController';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import type { TUser } from '@/components/otentikasi/user/type';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type PageProps = {
    users: TUser[];
};

export default function UsersPage() {
    const { users } = usePage<PageProps>().props;

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [userId, seTUserId] = useState<number | null>(null);
    const handleActionDelete = (user: TUser) => {
        seTUserId(user.id);
        setIsDeleteConfirmOpen(true);
    };
    const handleAction = (user_id: number | undefined, type: 'detail' | 'create' | 'update' | 'delete') => {
        router.get(
            formUser().url,
            {
                user_id: user_id,
                type: type
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    }
    const handleDelete = () => {
        router.delete(deleteUser(userId!).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteConfirmOpen(false);
            },
        });
    };

    const columns: ColumnDef<TUser>[] = [
        {
            accessorKey: 'name',
            header: 'Nama'
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'phone',
            header: 'No Telepon',
        },
        {
            id: 'roles',
            accessorFn: (row) => row.roles?.join(', '),
            header: 'Roles',

            cell: ({ row }) => {

                const roles = row.original.roles

                return roles?.join(', ')
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
                const user = row.original;

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
                                    onClick={() => handleAction(user.id, 'detail')}
                                >
                                    <Eye /> Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleAction(user.id, 'update')}
                                >
                                    <SquarePen /> Update
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleActionDelete(user)}
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
            <Head title="role" />
            <div className="mx-4 mt-4">
                <Button onClick={() => handleAction(undefined, 'create')}>
                    <Plus />
                    Tambah User Baru
                </Button>
            </div>
            <div className="m-4">
                <DataTable columns={columns} data={users} />
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

UsersPage.layout = {
    breadcrumbs: [
        {
            title: 'Otentikasi',
        },
        {
            title: 'User',
        },
    ],
};
