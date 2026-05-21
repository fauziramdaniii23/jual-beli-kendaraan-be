import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowDownNarrowWide,
    ArrowUpDown,
    ArrowUpWideNarrow, Eye,
    MoreHorizontal,
    SquarePen,
    Trash
} from 'lucide-react';
import React from "react";
import type { TUnit } from "@/components/inventory/stock-unit/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";

interface Props {
    onDetail: (id: number | undefined) => void;
    onEdit: (id: number | undefined) => void;
    onDelete: (id: number | undefined) => void;
}

export const getStockUnitColumns = ({ onDelete, onDetail, onEdit}: Props): ColumnDef<TUnit>[] => [
    {
        accessorKey: "name",
        header: ({ column }) => {
            const sorted = column.getIsSorted();

            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting()}
                    className="flex w-full items-center justify-between"
                >
                    Judul
                    {!sorted && <ArrowUpDown />}
                    {sorted === "asc" && <ArrowDownNarrowWide />}
                    {sorted === "desc" && <ArrowUpWideNarrow />}
                </Button>
            );
        },
    },
    {
        accessorKey: "year",
        header: ({ column }) => {
            const sorted = column.getIsSorted();

            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting()}
                    className="flex w-full items-center justify-between"
                >
                    Tahun
                    {!sorted && <ArrowUpDown />}
                    {sorted === "asc" && <ArrowDownNarrowWide />}
                    {sorted === "desc" && <ArrowUpWideNarrow />}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="text-right w-full">
                {row.getValue("year")}
            </div>
        ),
    },
    {
        accessorKey: "stnk_validity_period",
        header: ({ column }) => {
            const sorted = column.getIsSorted();

            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting()}
                    className="flex w-full items-center justify-between"
                >
                    Periode STNK
                    {!sorted && <ArrowUpDown />}
                    {sorted === "asc" && <ArrowDownNarrowWide />}
                    {sorted === "desc" && <ArrowUpWideNarrow />}
                </Button>
            );
        },
        cell: ({ row }) => {
            const value = row.getValue("stnk_validity_period") as string;

            return formatDate(value);
        },
    },
    {
        accessorKey: "formatted_price",
        header: ({ column }) => {
            const sorted = column.getIsSorted();

            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting()}
                    className="flex w-full items-center justify-between"
                >
                    Harga
                    {!sorted && <ArrowUpDown />}
                    {sorted === "asc" && <ArrowDownNarrowWide />}
                    {sorted === "desc" && <ArrowUpWideNarrow />}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="text-right w-full">
                {row.getValue("formatted_price")}
            </div>
        ),
    },
    {
        accessorKey: "status.ref_value",
        header: ({ column }) => {
            const sorted = column.getIsSorted();

            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting()}
                    className="flex w-full items-center justify-between"
                >
                    Status
                    {!sorted && <ArrowUpDown />}
                    {sorted === "asc" && <ArrowDownNarrowWide />}
                    {sorted === "desc" && <ArrowUpWideNarrow />}
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.original.status;

            const variant = (status?.ref_code?.toLowerCase() ?? "default") as
                | "available"
                | "sold"
                | "reserved"
                | "repair";

            return (
                <div className="text-center">
                    <Badge variant={variant}>
                        {status?.ref_value}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        enableHiding: false,
        cell: ({row}) => {
            const id = row.original.cars_id;

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
                                onClick={() => onDetail(id) }
                            >
                                <Eye /> Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onEdit(id) }
                            >
                                <SquarePen /> Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => onDelete(id)} className="text-red-500">
                                <Trash className="text-red-500" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
