import { router } from "@inertiajs/react";
import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    ArrowDownNarrowWide,
    ArrowUpDown,
    ArrowUpWideNarrow, Eye,
    MoreHorizontal, SquarePen, Trash
} from 'lucide-react';
import { useState } from 'react';
import { index as indexBrand } from '@/actions/App/Http/Controllers/Master/BrandController';
import CreateBrandDialog from '@/components/master/brand/add-brand';
import { ConfirmDeleteBrand } from '@/components/master/brand/delete-confirm';
import type { Brand } from '@/components/master/brand/type';
import UpdateBrandDialog from '@/components/master/brand/update-brand';
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
    brands: Brand[];
};

export default function MasterBrandPage() {
    const { brands } = usePage<PageProps>().props;
    const [brand, setBrand] = useState<Brand>({
        brand_id: 0,
        brand_name: '',
        is_active: false,
    });
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const handleAction = ( brand: Brand, type: 'update' | 'delete') => {
        setBrand(brand);

        if (type === 'update') {
            setIsUpdateDialogOpen(true);
        } else {
            setIsDeleteConfirmOpen(true);
        }
    };
    const handleOnStatusChange = (val: string) => {
        router.get(
            indexBrand().url,
            val === "all"
                ? {}
                : { status: val },
            {
                preserveState: true,
                replace: true,
            }
        );
    };
    const columns: ColumnDef<Brand>[] = [
        {
            accessorKey: 'brand_name',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Nama Merek
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
                const brand = row.original;

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
                                    onClick={() => console.log('Detail', brand)}
                                >
                                    <Eye /> View Detail
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleAction(brand, 'update')}
                                >
                                    <SquarePen /> Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleAction(brand, 'delete')}
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
            <Head title="Brand" />
            <div className="mx-4 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 max-w-48">
                    <span className="text-sm text-muted-foreground">
                        Status
                    </span>
                    <Select
                        onValueChange={(val) => handleOnStatusChange(val)}
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
                </div>
                <CreateBrandDialog/>
            </div>
            <div className="m-4">
                <DataTable columns={columns} data={brands} />
            </div>
            <UpdateBrandDialog brand={brand} isOpen={isUpdateDialogOpen} setIsOpen={(val) => setIsUpdateDialogOpen(val)} />
            <ConfirmDeleteBrand brand_id={brand.brand_id} isOpen={isDeleteConfirmOpen} setIsOpen={setIsDeleteConfirmOpen}/>
        </>
    );
}

MasterBrandPage.layout = {
    breadcrumbs: [
        {
            title: 'Master',
        },
        {
            title: 'Brand',
        },
    ],
};
