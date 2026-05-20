import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Settings,
    HelpCircle,
    LayoutList,
    PackageSearch,
    KeyRound, HandPlatter, Wallet, Users
} from 'lucide-react';
import { index as indexStockUnit } from '@/actions/App/Http/Controllers/inventory/StockUnitController';
import { index as indexBrand } from '@/actions/App/Http/Controllers/Master/MasterBrandController';
import { index as indexModel } from '@/actions/App/Http/Controllers/Master/MasterModelController';
import { index as indexReference } from '@/actions/App/Http/Controllers/Master/MasterReferenceController';
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
import { MASTER_REFERENCE_TYPE } from '@/const/constant';
import { dashboard } from '@/routes';

const menuItems = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Inventory',
        href: '#',
        icon: PackageSearch,
        items: [
            {
                title: 'Stock Unit',
                href: indexStockUnit(),
            },
            {
                title: 'Pengajuan Jual Unit',
                href: '/inventory/pengajuan-jual-unit',
            },
            {
                title: 'Garansi',
                href: '/inventory/garansi',
            },
            {
                title: 'Faktur Penjualan',
                href: '/inventory/faktur-penjualan',
            },
        ],
    },
    {
        title: 'Sales Service',
        href: '#',
        icon: HandPlatter,
        items: [
            {
                title: 'order',
                href: '/inventory/order',
            },
            {
                title: 'Pre Order',
                href: '/inventory/pre-order',
            },
            {
                title: 'Test Drive',
                href: '/inventory/test-driver',
            },
            {
                title: 'Tukar Tambah',
                href: '/inventory/tukar-tambah',
            },
        ]
    },
    {
        title: 'Customers',
        href: '#',
        icon: Users,
        items: [
            {
                title: 'Customer List',
                href: '/customers',
            },
            {
                title: 'Leads', //Menyimpan calon customer yang belum closing.
                href: '/customers/leads',
            },
            {
                title: 'Follow Up',
                href: '/customers/follow-up',
            },
        ]
    },
    {
        title: 'Financing',
        href: '#',
        icon: Wallet,
        items: [
            {
                title: 'Kredit',
                href: '/financing/credit',
            },
            {
                title: 'Simulasi Kredit',
                href: '/financing/simulation',
            },
            {
                title: 'Leasing Partner',
                href: '/financing/leasing',
            },
            {
                title: 'Approval',
                href: '/financing/approval',
            },
        ]
    },
    {
      title: 'News',
      href: '#',
      icon: LayoutGrid,
      items: [
          {
              title: 'Blog',
              href: '/news/blog',
          },
          {
              title: 'Promo',
              href: '/news/promo',
          },
          {
              title: 'Testimoni',
              href: '/news/testimonial',
          }
      ]
    },
    {
        title: 'Master',
        href: '#',
        icon: LayoutList,
        items: [
            {
                title: 'Merek',
                href: indexBrand(),
            },
            {
                title: 'Model',
                href: indexModel(),
            },
            {
                title: 'Transmisi',
                href: indexReference({type: MASTER_REFERENCE_TYPE.TRANSMISSION}),
            },
            {
                title: 'Type Mobil',
                href: indexReference({type: MASTER_REFERENCE_TYPE.CAR_TYPE}),
            },
            {
                title: 'Bahan Bakar',
                href: indexReference({type: MASTER_REFERENCE_TYPE.FUEL_TYPE}),
            },
            {
                title: 'Jumlah Kursi',
                href: indexReference({type: MASTER_REFERENCE_TYPE.SEAT_TYPE}),
            },
            {
                title: 'Jenis Plat',
                href: indexReference({type: MASTER_REFERENCE_TYPE.PLATE_TYPE}),
            }
        ],
    },
    {
        title: 'Otentikasi',
        href: '#',
        icon: KeyRound,
        items: [
            {
                title: 'User',
                href: '/auth/user',
            },
            {
                title: 'Role',
                href: '/auth/role',
            },
        ],
    }
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
