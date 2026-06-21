<?php

namespace App\services;


use App\Models\Car;
use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use App\Notifications\CarPublishedNotification;
use App\Notifications\OrderNotification;
use Illuminate\Support\Facades\Notification;

class NotificationService
{
    public function sendNotificationOrder(Order $order, Car $car, Customer $customer): void
    {
        $users = User::permission('notification')->get();
        Notification::send($users, new OrderNotification($order, $car, $customer));
    }
}
