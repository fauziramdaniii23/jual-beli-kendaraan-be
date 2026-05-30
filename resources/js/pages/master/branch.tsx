import { router } from "@inertiajs/react";
import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Plus, SquarePen, Trash } from 'lucide-react';
import React from 'react';
import { destroy as deleteBranch, form } from '@/actions/App/Http/Controllers/Master/MasterBranchController';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { normalizeUrl } from '@/lib/utils';

type TBranch = {
    branch_id: number;
    name: string;
    address: string;
    map_link: string;
    phone: string;
    image: string;
    image_name: string;
    image_src: string;
}
type PageProps = {
    branch: TBranch[];
};

export default function MasterBranchPage() {
    const { branch } = usePage<PageProps>().props;
    const [branchId, setBranchId] = React.useState<number | null>(null);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const handleAction = (branch_id: number | undefined, type: 'detail' | 'create' | 'update' | 'delete') => {
        router.get(
            form().url,
            {
                branch_id: branch_id,
                type: type
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    }
    const handleDelete = () => {
        router.delete(deleteBranch(branchId!).url, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteConfirmOpen(false);
            },
        });
    };

    const handleConfirmDelete = (branch: TBranch) => {
        setBranchId(branch.branch_id)
        setDeleteConfirmOpen(true);
    }

    const columns: ColumnDef<TBranch>[] = [
        {
            accessorKey: 'name',
            header: 'Nama Cabang'
        },
        {
            accessorKey: 'address',
            header: 'Alamat Cabang'
        },
        {
            accessorKey: 'phone',
            header: 'No Telepon'
        },
        {
            accessorKey: 'map_link',
            header: 'Link Map',
            cell: ({ row }) => {
                const mapLink = row.original.map_link;

                if (!mapLink) {
                    return '-';
                }

                const link = normalizeUrl(mapLink);

                return (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        Lihat Lokasi
                    </a>
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
                const reviews = row.original;

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
                                    onClick={() => handleAction(reviews.branch_id, 'detail')}
                                >
                                    <Eye /> Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleAction(reviews.branch_id, 'update')}
                                >
                                    <SquarePen /> Update
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleConfirmDelete(reviews)}
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
            <Head title="Master Cabang" />
            <div className="mx-4 mt-4">
                <Button onClick={() => handleAction(undefined, 'create')}>
                    <Plus />
                    Tambah Cabang Baru
                </Button>
            </div>
            <div className="m-4">
                <DataTable columns={columns} data={branch} />
            </div>
            <ConfirmDialog
                confirmText="Hapus"
                title="Hapus Cabang"
                description="Apakah Anda yakin ingin menghapus Cabang ini? Tindakan
                        ini tidak dapat dibatalkan dan dapat memengaruhi data
                        yang terkait dengan Cabang."
                open={isDeleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleDelete}
            />
        </>
    );
}

MasterBranchPage.layout = {
    breadcrumbs: [
        {
            title: 'Customer',
        },
        {
            title: 'Cabang',
        },
    ],
};
