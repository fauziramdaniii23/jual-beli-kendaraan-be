import { Link } from '@inertiajs/react';
import AppLogo from '@/components/app/app-logo';
import { NavFooter } from '@/components/app/nav-footer';
import { NavMain } from '@/components/app/nav-main';
import {
    Sidebar,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { menuItems, secondaryItems } from '@/const/constant';
import { dashboard } from '@/routes';

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
