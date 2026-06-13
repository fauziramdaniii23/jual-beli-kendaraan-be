import { Head } from '@inertiajs/react';
import { index as indexOrder } from '@/actions/App/Http/Controllers/Customer/OrderController';
import Title from '@/components/app/title';

export default function OrderPage() {
    return (
        <div>
            <Head title="Orders" />
            <Title title="Daftar Orders" description="Daftar Semua Order" />
        </div>
    )
}

OrderPage.layout = {
    breadcrumbs: [
        {
            title: 'Customer',
            href: indexOrder(),
        },
        {
            title: 'Orders',
            href: indexOrder(),
        },
    ],
};
