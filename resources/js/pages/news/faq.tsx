import { router } from "@inertiajs/react";
import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    ArrowDownNarrowWide,
    ArrowUpDown,
    ArrowUpWideNarrow,
    Eye,
    MoreHorizontal,
    SquarePen,
    Trash
} from 'lucide-react';
import React, { useState } from 'react';
import { destroy as deleteFaq } from '@/actions/App/Http/Controllers/News/FAQController';
import { index as indexFAQ } from '@/actions/App/Http/Controllers/News/FAQController';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import CreateFaqDialog from '@/components/news/faq/add-faq';
import type { TFaq } from '@/components/news/faq/type';
import UpdateFaqDialog from '@/components/news/faq/UpdateFaqDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import type { TMasterReference, TOptionItem } from '@/types';
import DetailFaqDialog from '@/components/news/faq/detail-faq';
import Title from '@/components/app/title';

type PageProps = {
    faqs: TFaq[];
    categories: TMasterReference[];
};

export default function ReviewsPage() {
    const { faqs, categories } = usePage<PageProps>().props;
    console.log(faqs);
    const [faqId, setFaqId] = React.useState<number | null>(null);
    const [faq, setFaq] = React.useState<TFaq>({
        question: '',
        answer: '',
        category_code: '',
        sort_order: 0,
        is_published: false,
    });

    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectCategory, setSelectCategory] = useState<string>('all');
    const handleAction = (faq: TFaq, type: 'detail' | 'update') => {
        setFaq(faq);

        if (type === 'update') {
            setIsUpdateDialogOpen(true);
        }

        if (type === 'detail') {
            setIsDetailOpen(true);
        }
    };

    const handleDelete = () => {
        router.delete(deleteFaq(faqId!).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteConfirmOpen(false);
            },
        });
    };

    const handleConfirmDelete = (faq: TFaq) => {
        setFaqId(faq.faq_id!)
        setIsDeleteConfirmOpen(true);
    }
    const submitFilter = () => {
        router.get(
            indexFAQ().url,
            {
                category: selectCategory === 'all' ? undefined : selectCategory,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };
    const columns: ColumnDef<TFaq>[] = [
        {
            accessorKey: 'question',
            header: 'Pertanyaan'
        },
        {
            accessorKey: 'category.ref_value',
            header: 'Kategori'
        },
        {
            accessorKey: 'sort_order',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Urutan FAQ
                        {!sorted && <ArrowUpDown />}
                        {sorted === "asc" && <ArrowDownNarrowWide />}
                        {sorted === "desc" && <ArrowUpWideNarrow />}
                    </Button>
                );
            },
            cell: ({row}) => {
                return (<div className="text-center">{row.getValue('sort_order')}</div>)
            }
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
                const faq = row.original;

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
                                    onClick={() => handleAction(faq, 'detail')}
                                >
                                    <Eye /> Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleAction(faq, 'update')}
                                >
                                    <SquarePen /> Update
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleConfirmDelete(faq)}
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

    const optionsCategories: TOptionItem[] = categories.map((c) => {
        return {
            label: c.ref_value,
            value: c.ref_code,
        }
    })

    return (
        <>
            <Head title="FAQ" />
            <Title title="Daftar FAQ" description="Daftar Semua FAQ" />
            <div className="mx-4 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 w-full">
                    <span className="text-sm text-muted-foreground">
                        Kategori
                    </span>
                    <Select
                        value={selectCategory}
                        onValueChange={(val) => setSelectCategory(val as string)}
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
                                {categories.map((category: TMasterReference) => {
                                    return (
                                        <SelectItem
                                            key={category.ref_code}
                                            value={category.ref_code}
                                        >
                                            {category.ref_value}
                                        </SelectItem>
                                    )
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button onClick={submitFilter}>
                        Filter
                    </Button>
                </div>
                <CreateFaqDialog categories={categories}/>
            </div>
            <div className="m-4">
                <DataTable columns={columns} data={faqs} />
            </div>
            <DetailFaqDialog faq={faq} optionCategories={optionsCategories} isOpen={isDetailOpen} setIsOpen={setIsDetailOpen}/>
            <UpdateFaqDialog
                optionCategories={optionsCategories}

                faq={faq} isOpen={isUpdateDialogOpen}
                setIsOpen={(val) => setIsUpdateDialogOpen(val)}
            />
            <ConfirmDialog
                confirmText="Hapus"
                title="Hapus Rating Customers"
                description="Apakah Anda yakin ingin menghapus Rating Customers ini?"
                open={isDeleteConfirmOpen}
                onOpenChange={setIsDeleteConfirmOpen}
                onConfirm={handleDelete}
            />
        </>
    );
}

ReviewsPage.layout = {
    breadcrumbs: [
        {
            title: 'News',
        },
        {
            title: 'FAQ',
        },
    ],
};
