import { router } from "@inertiajs/react";
import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Plus, SquarePen, Star, Trash } from 'lucide-react';
import React from 'react';
import { form } from '@/actions/App/Http/Controllers/Customer/ReviewsController';
import { destroy as deleteReview } from '@/actions/App/Http/Controllers/Customer/ReviewsController';
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

type TReviews = {
    review_id: number;
    car_id: number;
    user_id: number;
    rating: number;
    review_text: string;
    is_published: boolean;
    image: string;
    unit: {
        car_id: number;
        name: string;
    }
    user: {
        id: number;
        name: string;
    }
}
type PageProps = {
    reviews: TReviews[];
};

export default function ReviewsPage() {
    const { reviews } = usePage<PageProps>().props;
    const [reviewId, setReviewId] = React.useState<number | null>(null);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const handleAction = (review_id: number | undefined, type: 'detail' | 'create' | 'update' | 'delete') => {
        router.get(
            form().url,
            {
                review_id: review_id,
                type: type
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    }
    const handleDelete = () => {
        router.delete(deleteReview(reviewId!).url, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteConfirmOpen(false);
            },
        });
    };

    const handleConfirmDelete = (review: TReviews) => {
        setReviewId(review.review_id)
        setDeleteConfirmOpen(true);
    }

    const columns: ColumnDef<TReviews>[] = [
        {
            accessorKey: 'user.name',
            header: 'Nama Customer'
        },
        {
            accessorKey: 'unit.name',
            header: 'Unit'
        },
        {
            accessorKey: 'rating',
            header: () => (
                <div className="flex items-center justify-center gap-1">Rating</div>
            ),
            cell: ({ row }) => {
                const rating = row.original.rating;

                return (
                    <div className="flex items-center justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                                key={index}
                                className={`h-4 w-4 ${
                                    index < rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: 'is_published',
            header: () => (
                <div className="flex items-center justify-center gap-1">Status Published</div>
            ),
            cell:({row}) => {
                const isActived = row.getValue('is_published') as boolean;
                const label = isActived ? 'Publish' : 'Not Published';

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
                                    onClick={() => handleAction(reviews.review_id, 'detail')}
                                >
                                    <Eye /> Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleAction(reviews.review_id, 'update')}
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
            <Head title="Rating & Ulasan" />
            <Title title="Daftar Rating & Ulasan" description="Daftar Semua Rating & Ulasan" />
            <div className="mx-4 mt-4">
                <Button onClick={() => handleAction(undefined, 'create')}>
                    <Plus />
                    Tambah Rating & Ulasan Baru
                </Button>
            </div>
            <div className="m-4">
                <DataTable columns={columns} data={reviews} />
            </div>
            <ConfirmDialog
                confirmText="Hapus"
                title="Hapus Rating Customers"
                description="Apakah Anda yakin ingin menghapus Rating Customers ini?"
                open={isDeleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleDelete}
            />
        </>
    );
}

ReviewsPage.layout = {
    breadcrumbs: [
        {
            title: 'Customer',
        },
        {
            title: 'Rating & ulasan',
        },
    ],
};
