'use client';

import { Bell, Heart, MessageSquare, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        title: 'Komentar baru dari John',
        description: 'John berkomentar pada postingan Anda: "Ini sangat menarik!"',
        timestamp: '2 menit yang lalu',
        read: false,
        icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
    },
    {
        id: '2',
        title: 'Anda mendapat 10 likes baru',
        description: 'Postingan Anda telah menerima 10 likes dari pengguna lain.',
        timestamp: '15 menit yang lalu',
        read: false,
        icon: <Heart className="h-5 w-5 text-red-500" />,
    },
    {
        id: '3',
        title: 'Postingan Anda dibagikan',
        description: 'Sarah membagikan postingan Anda ke timeline mereka.',
        timestamp: '1 jam yang lalu',
        read: true,
        icon: <Share2 className="h-5 w-5 text-green-500" />,
    },
    {
        id: '4',
        title: 'Penjualan baru',
        description: 'Anda menerima pesanan baru dari Toko Online Anda.',
        timestamp: '3 jam yang lalu',
        read: true,
        icon: <Bell className="h-5 w-5 text-purple-500" />,
    },
    {
        id: '5',
        title: 'Update sistem',
        description: 'Sistem kami telah diperbarui dengan fitur-fitur baru.',
        timestamp: '1 hari yang lalu',
        read: true,
        icon: <Bell className="h-5 w-5 text-gray-500" />,
    },
    {
        id: '6',
        title: 'Update sistem',
        description: 'Sistem kami telah diperbarui dengan fitur-fitur baru.',
        timestamp: '1 hari yang lalu',
        read: true,
        icon: <Bell className="h-5 w-5 text-gray-500" />,
    },
]


interface NotificationItem {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
    icon?: React.ReactNode;
}

interface NotificationIconProps {
    maxDisplay?: number;
    className?: string;
}

export function NotificationIcon(
    {
        maxDisplay = 5,
        className
    }: NotificationIconProps) {

    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
    const handleNotificationClick = (notification: NotificationItem) => {
        console.log('Notifikasi diklik:', notification)
    }

    const handleMarkAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
    }
    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }
    const unreadCount = notifications.filter((n) => !n.read).length;
    const displayNotifications = notifications.slice(0, maxDisplay);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn('relative', className)}
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -right-2 -top-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-0" align="end">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-semibold text-base">Notifikasi</h2>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto px-2 py-1"
                            onClick={handleMarkAllAsRead}
                        >
                            Tandai semua sebagai dibaca
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                    {displayNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Bell className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                            <p className="text-sm text-muted-foreground">Tidak ada notifikasi</p>
                        </div>
                    ) : (
                        displayNotifications.map((notification, index) => (
                            <div key={notification.id}>
                                <div
                                    className={cn(
                                        'p-4 cursor-pointer transition-colors hover:bg-accent',
                                        !notification.read && 'bg-muted/50'
                                    )}
                                    onClick={() => {
                                        handleNotificationClick(notification);

                                        if (!notification.read) {
                                            handleMarkAsRead(notification.id);
                                        }
                                    }}
                                >
                                    <div className="flex gap-3">
                                        {notification.icon && (
                                            <div className="flex-shrink-0 mt-1">
                                                {notification.icon}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-medium text-sm leading-tight">
                                                    {notification.title}
                                                </p>
                                                {!notification.read && (
                                                    <div
                                                        className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                {notification.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {notification.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {index < displayNotifications.length - 1 && (
                                    <Separator className="m-0" />
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {notifications.length > maxDisplay && (
                    <>
                        <Separator className="m-0" />
                        <div className="p-3 text-center">
                            <Button variant="ghost" size="sm" className="text-xs">
                                Lihat semua notifikasi ({notifications.length})
                            </Button>
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
}
