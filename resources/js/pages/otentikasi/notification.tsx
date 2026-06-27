import { router } from '@inertiajs/react';
import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MailQuestion, MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import { update } from '@/actions/App/Http/Controllers/Otentikasi/NotificationController';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import Title from '@/components/app/title';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    hasNotif: boolean;
};

type PageProps = {
    roles: TRole[];
};

export default function MasterNotificationPage() {
    const { roles } = usePage<PageProps>().props;

    const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] =
        useState<boolean>(false);
    const [hasNotif, setHasNotif] = useState<boolean>(false);
    const [role, setRole] = useState<string>('');
    const openUpdateConfirm = (data: TRole) => {
        setRole(data.name);
        setHasNotif(data.hasNotif);
        setIsUpdateConfirmOpen(true);
    };
    const handleUpdateNotifikasi = () => {
        router.post(update().url, {
            role: role,
            hasNotif: hasNotif,
        });
    };

    const columns: ColumnDef<TRole>[] = [
        {
            accessorKey: 'name',
            header: () => <div className="text-center">Nama Notification</div>,
            cell: ({ row }) => {
                const name = row.original.name;

                return <div className="text-center">{name}</div>;
            },
        },
        {
            accessorKey: 'hasNotif',
            header: () => <div className="text-center">Dapat Notifikasi</div>,
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="items-center text-center">
                        <Checkbox
                            checked={data.hasNotif}
                            onCheckedChange={() => openUpdateConfirm(data)}
                        />
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-center">Aksi</div>,
            enableHiding: false,
            cell: ({ row }) => {
                const Notification = row.original;

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
                                        openUpdateConfirm(Notification)
                                    }
                                >
                                    <MailQuestion /> Update Notifikasi
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
            <Head title="Notification" />
            <Title
                title="Daftar Notification"
                description="Daftar Semua Notification"
            />
            <div className="m-4">
                <DataTable
                    showRowNumber={false}
                    columns={columns}
                    data={roles}
                />
            </div>
            <ConfirmDialog
                confirmText="Update"
                title="Update Notification"
                description={`Apakah Anda yakin ingin ${hasNotif ? 'Menonaktifkan' : 'Mengaktifkan'} Notification pada role ini?`}
                open={isUpdateConfirmOpen}
                onOpenChange={setIsUpdateConfirmOpen}
                onConfirm={handleUpdateNotifikasi}
            />
        </>
    );
}

MasterNotificationPage.layout = {
    breadcrumbs: [
        {
            title: 'Otentikasi',
        },
        {
            title: 'Notification',
        },
    ],
};
