import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Settings,
    HelpCircle, LayoutList, PackageSearch
} from 'lucide-react';
import { index as indexBrand } from '@/actions/App/Http/Controllers/Master/MasterBrandController';
import { index as indexModel } from '@/actions/App/Http/Controllers/Master/MasterModelController';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';

const menuItems = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Inventory & Sales',
        href: '#',
        icon: PackageSearch,
        items: [
            {
                title: 'Stock Unit',
                href: '/inventory/stock-unit',
            },
            {
                title: 'Pengajuan Jual Unit',
                href: '/inventory/pengajuan-jual-unit',
            },
            {
                title: 'Tukar Tambah',
                href: '/inventory/tukar-tambah',
            },
            {
                title: 'Pre Order',
                href: '/inventory/pre-order',
            },
            {
                title: 'Faktur Penjualan',
                href: '/inventory/faktur-penjualan',
            },
        ],
    },
    {
        title: 'Master',
        href: '#',
        icon: LayoutList,
        items: [
            {
                title: 'Brand',
                href: indexBrand(),
            },
            {
                title: 'Model',
                href: indexModel(),
            },
            {
                title: 'Transmission',
                href: '/master/transmission',
            },
            {
                title: 'Type Mobil',
                href: '/master/type-mobil',
            },
            {
                title: 'Bahan Bakar',
                href: '/master/bahan-bakar',
            },
            {
                title: 'User',
                href: '/master/user',
            },
        ],
    },
]

const secondaryItems = [
    {
        title: 'Settings',
        href: '#',
        icon: Settings,
    },
    {
        title: 'Help',
        href: '#',
        icon: HelpCircle,
    },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <NavMain items={menuItems} />

            <SidebarFooter>
                <NavFooter items={secondaryItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
