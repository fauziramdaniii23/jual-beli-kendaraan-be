<?php

namespace App\services;

class NotificationService
{
    public function markAsRead(string $id)
    {
        $notification = auth()
            ->user()
            ->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        return response()->json([
            'message' => 'success',
        ]);
    }

    public function unreadCount()
    {
        return [
            'count' => auth()
                ->user()
                ->unreadNotifications()
                ->count(),
        ];
    }
}
