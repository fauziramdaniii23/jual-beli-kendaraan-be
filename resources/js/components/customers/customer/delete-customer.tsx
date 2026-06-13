import { router } from "@inertiajs/react";
import React, { useState } from 'react';
import { destroy as deleteCustomer } from '@/actions/App/Http/Controllers/Customer/CustomerController';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from '@/components/ui/spinner';

interface Props {
    customer_id: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}
export function ConfirmDeleteCustomer({ customer_id, isOpen, setIsOpen }: Props) {
    const [loading, setLoading] = useState(false);
    const handleDelete = () => {
        router.delete(deleteCustomer(customer_id).url, {
            preserveScroll: true,
            onStart: () => {
                setLoading(true);
            },
            onSuccess: () => {
                setLoading(false);
                setIsOpen(false);
            },
        });
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Hapus Customer
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus Customer ini?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Batal
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading && <Spinner />}
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

