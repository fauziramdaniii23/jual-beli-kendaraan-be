import * as React from 'react';

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';

import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';


// ======================================================
// DATA TABLE COMPONENT
// ======================================================

interface DataTableProps<TData, TValue> {
    className?: string;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    showPagination?: boolean;
    showRowPerPage?: boolean;
    showRowNumber?: boolean;
    pageSizeOptions?: number[];
    onRowSelectionChange?: (row: TData[]) => void;
}

export function DataTable<TData, TValue>(
    {
        className,
        columns,
        data,
        showPagination = true,
        showRowPerPage = true,
        showRowNumber = true,
        pageSizeOptions = [10, 20, 30, 50, 100],
        onRowSelectionChange
    }: DataTableProps<TData, TValue>) {

    const rowNumberColumn: ColumnDef<TData> = {
        id: "no",
        header: () => (
            <div className="text-center">
                No
            </div>
        ),
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const rowNumber = table.getRowModel().rows
                    .findIndex(
                        (item) => item.id === row.id
                    ) + 1;

            return (
                <div className="text-center">
                    {pageIndex * pageSize + rowNumber}
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
        size: 60,
    };

    const mergedColumns: ColumnDef<TData, TValue>[] =
        showRowNumber
            ? [
                rowNumberColumn as ColumnDef<TData, TValue>,
                ...columns,
            ]
            : columns;

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [pagination, setPagination] =
        React.useState({
            pageIndex: 0,
            pageSize: pageSizeOptions[0]
        });

    const table = useReactTable({
        data,
        columns: mergedColumns,
        autoResetPageIndex: false,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange:
        setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
            globalFilter,
        }
    });

    React.useEffect(() => {
        const selectedRows = table
            .getSelectedRowModel()
            .rows
            .map((row) => row.original);

        onRowSelectionChange?.(selectedRows);
    }, [rowSelection]);

    return (
        <div className="w-full space-y-4">
            {showRowPerPage && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Rows per page
                        </span>
                        <Select
                            value={String(
                                table.getState().pagination.pageSize
                            )}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                {pageSizeOptions.map((pageSize) => (
                                    <SelectItem
                                        key={pageSize}
                                        value={String(pageSize)}
                                    >
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* SEARCH */}
                    <InputGroup className="max-w-xs">
                        <InputGroupInput
                            placeholder="Search..."
                            value={globalFilter}
                            onChange={(event) =>
                                setGlobalFilter(
                                    event.target.value
                                )
                            }
                        />
                        <InputGroupAddon>
                            <Search className="h-4 w-4" />
                        </InputGroupAddon>

                        <InputGroupAddon align="inline-end">
                            {table.getFilteredRowModel().rows.length} results
                        </InputGroupAddon>

                    </InputGroup>
                </div>
            )}

            <div className="rounded-md border">
                {/* overflow dipindah ke sini, langsung membungkus Table */}
                <div className={cn("overflow-auto", className)}>
                    <Table className="border-collapse border border-border">
                        <TableHeader className="bg-muted h-12">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="sticky top-0 z-10 border border-border bg-muted" // ← tambah bg-muted
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() &&
                                            'selected'
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="border border-border">
                                                {flexRender( cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={mergedColumns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </div>
            </div>

            {/* ====================================================== */}
            {/* PAGINATION */}
            {/* ====================================================== */}
            {showPagination && (
                <div className="flex items-center justify-between">
                    {/* ROWS PER PAGE */}
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                            Showing{" "}
                            {table.getState().pagination.pageIndex *
                                table.getState().pagination.pageSize + 1}
                            {" - "}
                            {Math.min(
                                (table.getState().pagination.pageIndex + 1) *
                                table.getState().pagination.pageSize,
                                table.getFilteredRowModel().rows.length
                            )}
                            {" of "}
                            {table.getFilteredRowModel().rows.length}
                        </div>
                    </div>

                    {/* PAGINATION */}
                    <div className="flex items-center gap-2">

                        {/* PREVIOUS */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>

                        {/* PAGE NUMBERS */}
                        <div className="flex items-center gap-1">
                            {(() => {
                                const currentPage = table.getState().pagination.pageIndex;

                                const totalPages = table.getPageCount();

                                const pages: (number | string)[] = [];

                                /*
                                Example:
                                1 ... 4 5 6 ... 20
                                */

                                // ALWAYS SHOW FIRST PAGE
                                pages.push(0);

                                // LEFT DOTS
                                if (currentPage > 2) {
                                    pages.push('left-dots');
                                }

                                // CURRENT PAGE RANGE
                                for (let i = Math.max(1, currentPage - 1);
                                     i <= Math.min(
                                         totalPages - 2,
                                         currentPage + 1
                                     );
                                     i++
                                ) {
                                    pages.push(i);
                                }

                                // RIGHT DOTS
                                if (currentPage < totalPages - 3) {
                                    pages.push('right-dots');
                                }

                                // ALWAYS SHOW LAST PAGE
                                if (totalPages > 1) {
                                    pages.push(totalPages - 1);
                                }

                                return pages.map((page, index) => {

                                    // DOTS
                                    if (page === 'left-dots' || page === 'right-dots') {
                                        return (
                                            <div
                                                key={`${page}-${index}`}
                                                className="flex h-8 w-8 items-center justify-center"
                                            >
                                                ...
                                            </div>
                                        );
                                    }

                                    // PAGE BUTTON
                                    const isActive = currentPage === page;
                                    return (
                                        <Button
                                            key={page}
                                            variant={isActive ? 'default' : 'outline'}
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() =>
                                                table.setPageIndex(Number(page))
                                            }
                                        >
                                            {Number(page) + 1}
                                        </Button>
                                    );
                                });
                            })()}

                        </div>

                        {/* NEXT */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
