<?php

namespace App\Notifications;

use App\Models\Car;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public Order $order;
    public Car $car;
    public Customer $customer;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, Car $car, Customer $customer)
    {
        $this->order = $order;
        $this->car = $car;
        $this->customer = $customer;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Order')
            ->view('emails.order-notification', [
                'order' => $this->order,
                'unit' => $this->car,
                'customer' => $this->customer,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Order',
        ];
    }
}
