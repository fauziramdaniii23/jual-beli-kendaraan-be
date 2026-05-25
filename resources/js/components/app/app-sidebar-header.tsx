import { Breadcrumbs } from '@/components/app/breadcrumbs';
import { NavUser } from '@/components/app/nav-user';
import { NotificationIcon } from '@/components/app/notification-icon';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({breadcrumbs = []}: {breadcrumbs?: BreadcrumbItemType[]}) {

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="w-full flex justify-between">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <div className="flex items-center gap-4">
                    <NotificationIcon/>
                    <div className="w-36">
                        <NavUser />
                    </div>
                </div>
            </div>
        </header>
    );
}
