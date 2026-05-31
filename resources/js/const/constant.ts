import { HelpCircle, KeyRound, LayoutGrid, LayoutList, PackageSearch, Users, Newspaper } from 'lucide-react';
import { index as indexReviews } from '@/actions/App/Http/Controllers/Customer/ReviewsController';
import { index as indexStockUnit } from '@/actions/App/Http/Controllers/inventory/StockUnitController';
import { index as indexBranch } from '@/actions/App/Http/Controllers/Master/MasterBranchController';
import { index as indexBrand } from '@/actions/App/Http/Controllers/Master/MasterBrandController';
import { index as indexModel } from '@/actions/App/Http/Controllers/Master/MasterModelController';
import { index as indexReference } from '@/actions/App/Http/Controllers/Master/MasterReferenceController';
import { indexRole } from '@/actions/App/Http/Controllers/Otentikasi/RoleAndPermissionController';
import { index as indexUsers } from '@/actions/App/Http/Controllers/Otentikasi/UserController';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { PERMISSIONS } from '@/types/permission';

export const MASTER_REFERENCE_TYPE = {
    FUEL_TYPE: 'FUEL_TYPE',
    TRANSMISSION: 'TRANSMISSION',
    CAR_TYPE: 'CAR_TYPE',
    SEAT_TYPE: 'SEAT_TYPE',
    PLATE_TYPE: 'PLATE_TYPE',
} as const;

export const MASTER_REFERENCE_LABEL = {
    FUEL_TYPE: 'Bahan Bakar',
    TRANSMISSION: 'Transmisi',
    CAR_TYPE: 'Jenis Mobil',
    SEAT_TYPE: 'Jumlah Kursi',
    PLATE_TYPE: 'Jenis Plat',
} as const;

export const TYPE_LABEL = {
    create: 'Tambah',
    update: 'Update',
    detail: 'Detail',
} as const;

export const menuItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        permission: PERMISSIONS.DASHBOARD_VIEW
    },
    {
        title: 'Inventory',
        href: '#',
        icon: PackageSearch,
        permission: PERMISSIONS.INVENTORY_VIEW,
        items: [
            {
                title: 'Stock Unit',
                href: indexStockUnit(),
                permission: '',
                icon: null,
            },
            {
                title: 'Pengajuan Jual Unit',
                href: '/inventory/pengajuan-jual-unit',
                permission: '',
                icon: null,
            },
            {
                title: 'Garansi',
                href: '/inventory/garansi',
                permission: '',
                icon: null,
            },
            {
                title: 'Faktur Penjualan',
                href: '/inventory/faktur-penjualan',
                permission: '',
                icon: null,
            },
        ],
    },
    // {
    //     title: 'Sales Service',
    //     href: '#',
    //     icon: HandPlatter,
    //     permission: PERMISSIONS.SALES_VIEW,
    //     items: [
    //         {
    //             title: 'order',
    //             href: '/inventory/order',
    //             permission: '',
    //             icon: null,
    //         },
    //         {
    //             title: 'Pre Order',
    //             href: '/inventory/pre-order',
    //             permission: '',
    //             icon: null,
    //         },
    //         {
    //             title: 'Test Drive',
    //             href: '/inventory/test-driver',
    //             permission: '',
    //             icon: null,
    //         },
    //         {
    //             title: 'Tukar Tambah',
    //             href: '/inventory/tukar-tambah',
    //             permission: '',
    //             icon: null,
    //         },
    //     ]
    // },
    {
        title: 'Customers',
        href: '#',
        icon: Users,
        permission: PERMISSIONS.CUSTOMER_VIEW,
        items: [
            {
                title: 'Customer List',
                href: '/customers',
                permission: '',
                icon: null,
            },
            {
                title: 'Order',
                href: '/inventory/order',
                permission: '',
                icon: null,
            },
            {
                title: 'Follow Up',
                href: '/customers/follow-up',
                permission: '',
                icon: null,
            },
            {
                title: 'Rating & Ulasan',
                href: indexReviews(),
                permission: '',
                icon: null,
            }
        ]
    },
    {
        title: 'News',
        href: '#',
        icon: Newspaper,
        permission: PERMISSIONS.NEWS_VIEW,
        items: [
            {
                title: 'FAQ',
                href: '/news/blog',
                permission: '',
                icon: null,
            },
            {
                title: 'Blog',
                href: '/news/blog',
                permission: '',
                icon: null,
            },
            {
                title: 'Promo',
                href: '/news/promo',
                permission: '',
                icon: null,
            },
        ]
    },
    {
        title: 'Master',
        href: '#',
        icon: LayoutList,
        permission: PERMISSIONS.MASTER_VIEW,
        items: [
            {
                title: 'Cabang',
                href: indexBranch(),
                permission: '',
                icon: null,
            },
            {
                title: 'Merek',
                href: indexBrand(),
                permission: '',
                icon: null,
            },
            {
                title: 'Model',
                href: indexModel(),
                permission: '',
                icon: null,
            },
            {
                title: 'Transmisi',
                href: indexReference({type: MASTER_REFERENCE_TYPE.TRANSMISSION}),
                permission: '',
                icon: null,
            },
            {
                title: 'Type Mobil',
                href: indexReference({type: MASTER_REFERENCE_TYPE.CAR_TYPE}),
                permission: '',
                icon: null,
            },
            {
                title: 'Bahan Bakar',
                href: indexReference({type: MASTER_REFERENCE_TYPE.FUEL_TYPE}),
                permission: '',
                icon: null,
            },
            {
                title: 'Jumlah Kursi',
                href: indexReference({type: MASTER_REFERENCE_TYPE.SEAT_TYPE}),
                permission: '',
                icon: null,
            },
            {
                title: 'Jenis Plat',
                href: indexReference({type: MASTER_REFERENCE_TYPE.PLATE_TYPE}),
                permission: '',
                icon: null,
            }
        ],
    },
    {
        title: 'Otentikasi',
        href: '#',
        icon: KeyRound,
        permission: PERMISSIONS.OTENTIKASI_VIEW,
        items: [
            {
                title: 'User',
                href: indexUsers(),
                permission: '',
                icon: null,
            },
            {
                title: 'Role & Permissions',
                href: indexRole(),
                permission: '',
                icon: null,
            },
        ],
    }
]

export const secondaryItems = [
    {
        title: 'Help',
        href: '#',
        icon: HelpCircle,
        permission: '',
    },
]

