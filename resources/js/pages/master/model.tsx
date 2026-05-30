import { router } from "@inertiajs/react";
import { Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    ArrowDownNarrowWide,
    ArrowUpDown,
    ArrowUpWideNarrow, Eye,
    MoreHorizontal, SquarePen, Trash,
} from 'lucide-react';
import React, { useState } from 'react';
import { index as indexModel } from '@/actions/App/Http/Controllers/Master/MasterModelController';
import type { TBrand } from '@/components/master/brand/type';
import CreateModelDialog from '@/components/master/model/add-model';
import { ConfirmDeleteModel } from '@/components/master/model/delete-confirm';
import type { TModel } from '@/components/master/model/type';
import UpdateModelDialog from '@/components/master/model/update-model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList
} from '@/components/ui/combobox';
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
    carModels: TModel[];
    brands: TBrand[];
};

export default function MasterModelPage() {
    const { carModels, brands } = usePage<PageProps>().props;
    const [model, seTModel] = useState<TModel>({
        model_id: 0,
        model_name: '',
        brand_id: 0,
        brand: {
            brand_id: 0,
            brand_name: '',
            is_active: false,
        },
        is_active: false,
    });
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<TBrand | null>(null);
    const [selectStatus, setSelectStatus] = useState<string>('all');
    const handleAction = (model: TModel, type: 'update' | 'delete') => {
        seTModel(model);

        if (type === 'update') {
            setIsUpdateDialogOpen(true);
        } else {
            setIsDeleteConfirmOpen(true);
        }
    };
    const submitFilter = () => {
        router.get(
            indexModel().url,
            {
                brand_id: selectedBrand?.brand_id || undefined,
                status: selectStatus === "all" ? undefined : selectStatus,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const columns: ColumnDef<TModel>[] = [
        {
            accessorKey: 'model_name',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Nama Model
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
            accessorKey: 'brand.brand_name',
            header: ({ column }) => {
                const sorted = column.getIsSorted();

                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting()}
                        className="flex w-full items-center justify-between"
                    >
                        Nama Merek
                        {!sorted && <ArrowUpDown />}
                        {sorted === 'asc' && <ArrowDownNarrowWide />}
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
                const model : TModel = row.original;

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
                                    onClick={() => handleAction(model, 'update')}
                                >
                                    <SquarePen /> Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleAction(model, 'delete')}
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
            <Head title="Model" />
            <div className="mx-4 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 w-full">
                    <span className="text-sm text-muted-foreground">
                        Status
                    </span>
                    <Select
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
                    <span className="text-sm text-muted-foreground">
                        Nama Merek
                    </span>
                    <div className="w-full max-w-56">
                        <Combobox
                            items={brands}
                            itemToStringLabel={(item : TBrand) => item.brand_name}
                            onValueChange={(val : TBrand | null) => setSelectedBrand(val)}
                        >
                            <ComboboxInput placeholder="Pilih Merek Mobil" showClear/>

                            <ComboboxContent>
                                <ComboboxEmpty>Brand tidak ditemukan.</ComboboxEmpty>

                                <ComboboxList>
                                    {(brand) => (
                                        <ComboboxItem
                                            key={brand.brand_id}
                                            value={brand}
                                        >
                                            {brand.brand_name}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                    <Button onClick={submitFilter}>
                        Filter
                    </Button>
                </div>
                <CreateModelDialog brands={brands}/>
            </div>
            <div className="m-4">
                <DataTable columns={columns} data={carModels} />
            </div>
            <UpdateModelDialog model={model} brands={brands} isOpen={isUpdateDialogOpen} setIsOpen={(val) => setIsUpdateDialogOpen(val)} />
            <ConfirmDeleteModel model_id={model.model_id} isOpen={isDeleteConfirmOpen} setIsOpen={setIsDeleteConfirmOpen}/>
        </>
    );
}

MasterModelPage.layout = {
    breadcrumbs: [
        {
            title: 'Master',
        },
        {
            title: 'model',
        },
    ],
};
