import { router } from "@inertiajs/react";
import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Plus, SquarePen, Trash } from 'lucide-react';
import React from 'react';
import { destroy as deletePromo, form  } from '@/actions/App/Http/Controllers/News/PromoController';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import Title from '@/components/app/title';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type TPromo = {
    promo_id: number;
    name: string;
    code: string;
    type: string;
    discount_value: number;
    description: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    image: string;
}
type PageProps = {
    promos: TPromo[];
};

export default function PromosPage() {
    const { promos } = usePage<PageProps>().props;

    const [promoId, setPromoId] = React.useState<number | null>(null);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const handleAction = (promo_id: number | undefined, type: 'detail' | 'create' | 'update' | 'delete') => {
        router.get(
            form().url,
            {
                promo_id: promo_id,
                type: type
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    }
    const handleDelete = () => {
        router.delete(deletePromo(promoId!).url, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteConfirmOpen(false);
            },
        });
    };

    const handleConfirmDelete = (review: TPromo) => {
        setPromoId(review.promo_id)
        setDeleteConfirmOpen(true);
    }

    const columns: ColumnDef<TPromo>[] = [
        {
            accessorKey: 'name',
            header: 'Nama Promo'
        },
        {
            accessorKey: 'unit.name',
            header: 'Unit'
        },
        {
            accessorKey: 'is_active',
            header: () => (
                <div className="flex items-center justify-center gap-1">Status Published</div>
            ),
            cell:({row}) => {
                const isActived = row.getValue('is_active') as boolean;
                const label = isActived ? 'Aktif' : 'Tidak Aktif';

                return (
                    <div className="flex items-center justify-center gap-1">
                        <Badge variant={isActived ? 'success' : 'destructive'}>{label}</Badge>
                    </div>
                )
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
                const promos = row.original;

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
                                    onClick={() => handleAction(promos.promo_id, 'detail')}
                                >
                                    <Eye /> Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleAction(promos.promo_id, 'update')}
                                >
                                    <SquarePen /> Update
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleConfirmDelete(promos)}
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
            <Head title="Promo" />
            <Title title="Daftar Promo" description="Daftar Semua Promo" />
            <div className="mx-4 mt-4">
                <Button onClick={() => handleAction(undefined, 'create')}>
                    <Plus />
                    Tambah Promo Baru
                </Button>
            </div>
            <div className="m-4">
                <DataTable columns={columns} data={promos} />
            </div>
            <ConfirmDialog
                confirmText="Hapus"
                title="Hapus Promo"
                description="Apakah Anda yakin ingin menghapus Rating Customers ini?"
                open={isDeleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleDelete}
            />
        </>
    );
}

PromosPage.layout = {
    breadcrumbs: [
        {
            title: 'News',
        },
        {
            title: 'Promo',
        },
    ],
};
