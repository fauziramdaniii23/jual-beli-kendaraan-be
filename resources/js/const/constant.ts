import { HandPlatter, HelpCircle, KeyRound, LayoutGrid, LayoutList, PackageSearch, Users } from 'lucide-react';
import { index as indexStockUnit } from '@/actions/App/Http/Controllers/inventory/StockUnitController';
import { index as indexBrand } from '@/actions/App/Http/Controllers/Master/MasterBrandController';
import { index as indexModel } from '@/actions/App/Http/Controllers/Master/MasterModelController';
import { index as indexReference } from '@/actions/App/Http/Controllers/Master/MasterReferenceController';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

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

export const menuItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        permission: ''
    },
    {
        title: 'Inventory',
        href: '#',
        icon: PackageSearch,
        permission: '',
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
    {
        title: 'Sales Service',
        href: '#',
        icon: HandPlatter,
        permission: '',
        items: [
            {
                title: 'order',
                href: '/inventory/order',
                permission: '',
                icon: null,
            },
            {
                title: 'Pre Order',
                href: '/inventory/pre-order',
                permission: '',
                icon: null,
            },
            {
                title: 'Test Drive',
                href: '/inventory/test-driver',
                permission: '',
                icon: null,
            },
            {
                title: 'Tukar Tambah',
                href: '/inventory/tukar-tambah',
                permission: '',
                icon: null,
            },
        ]
    },
    {
        title: 'Customers',
        href: '#',
        icon: Users,
        permission: '',
        items: [
            {
                title: 'Customer List',
                href: '/customers',
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
                href: '/news/review',
                permission: '',
                icon: null,
            }
        ]
    },
    {
        title: 'News',
        href: '#',
        icon: LayoutGrid,
        permission: '',
        items: [
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
        permission: 'master.view',
        items: [
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
        permission: '',
        items: [
            {
                title: 'User',
                href: '/auth/user',
                permission: '',
                icon: null,
            },
            {
                title: 'Role',
                href: '/auth/role',
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

