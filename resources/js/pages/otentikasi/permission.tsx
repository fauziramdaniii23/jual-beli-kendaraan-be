import { router, Head, usePage } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react';
import { indexRole, updatePermission } from '@/actions/App/Http/Controllers/Otentikasi/RoleAndPermissionController';
import Title from '@/components/app/title';
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/ui/data-table/data-table'

type TRole = {
    id: number
    name: string
}

type TPermission = {
    modul: string
    nama_modul: string
    view: boolean | null
    create: boolean | null
    edit: boolean | null
    delete: boolean | null
}

type PageProps = {
    role: TRole
    permissions: TPermission[]
}

type PermissionAction =
    | 'view'
    | 'create'
    | 'edit'
    | 'delete'

type PermissionState = Record<string, boolean>
export default function MasterPermissionPage() {
    const { role, permissions } = usePage<PageProps>().props

    const [payload, setPayload] = useState<PermissionState>({})
    const [data, setData] = useState<TPermission[]>(permissions)
    useEffect(() => {
        console.log(payload)
    }, [payload])

    const initPayload = ( permission: string,  checked: boolean) => {

        setPayload((prev) => ({
            ...prev,
            [permission]: checked,
        }))
    }

    const handleCheckboxChange = (
        modul: string,
        action: PermissionAction,
        checked: boolean
    ) => {
        const permission = `${modul}.${action}`
        initPayload(permission, checked)
        setData((prev) =>
            prev.map((item) => {
                if (item.modul !== modul) {
                    return item
                }

                return {
                    ...item,
                    [action]: checked,
                }
            })
        )
    }

    const handleSubmit = () => {
        router.put(
            updatePermission(role.id),
            {
                permissions: payload,
            }
        )
    }

    const renderCheckbox = (value: boolean | null, modul: string, action: PermissionAction) => {
        if (value === null) {
            return null
        }

        return (
            <div className="items-center text-center">
                <Checkbox
                    checked={value}
                    onCheckedChange={(checked) =>
                        handleCheckboxChange(modul, action, checked as boolean)
                    }
                />
            </div>
        )
    }

    const columns: ColumnDef<TPermission>[] = [
        {
            accessorKey: 'nama_modul',
            header: 'Nama Modul',
        },

        {
            accessorKey: 'view',
            header: () => (
                <div className="items-center text-center">
                    View
                </div>
            ),

            cell: ({ row }) =>
                renderCheckbox(
                    row.original.view,
                    row.original.modul,
                    'view'
                ),
        },

        {
            accessorKey: 'create',
            header: () => (
                <div className="items-center text-center">
                    Create
                </div>
            ),

            cell: ({ row }) =>
                renderCheckbox(
                    row.original.create,
                    row.original.modul,
                    'create'
                ),
        },

        {
            accessorKey: 'edit',
            header: () => (
                <div className="items-center text-center">
                    Update
                </div>
            ),

            cell: ({ row }) =>
                renderCheckbox(
                    row.original.edit,
                    row.original.modul,
                    'edit'
                ),
        },

        {
            accessorKey: 'delete',
            header: () => (
                <div className="items-center text-center">
                    Delete
                </div>
            ),

            cell: ({ row }) =>
                renderCheckbox(
                    row.original.delete,
                    row.original.modul,
                    'delete'
                ),
        },
    ]

    return (
        <>
            <Head title="Permission" />
            <Title title={`Permission role ${role.name}`} description={`Permission akse menu untuk role ${role.name}`} />
            <div className="mx-4 mt-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold">
                    Permission {role.name}
                </h1>

                <Button onClick={handleSubmit}>
                    Simpan
                </Button>
            </div>

            <div className="m-4">
                <DataTable
                    showPagination={false}
                    showRowPerPage={false}
                    showRowNumber={false}
                    columns={columns}
                    data={data}
                />
            </div>
        </>
    )
}

MasterPermissionPage.layout = {
    breadcrumbs: [
        {
            title: 'Otentikasi',
        },
        {
            title: 'Role',
            href: indexRole(),
        },
        {
            title: 'Permission',
        }
    ],
}
