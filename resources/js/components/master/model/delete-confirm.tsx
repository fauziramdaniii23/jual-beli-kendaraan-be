import { router } from "@inertiajs/react";
import { destroy as deleteModel } from '@/actions/App/Http/Controllers/Master/MasterModelController';
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
import React, { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface Props {
    model_id: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}
export function ConfirmDeleteModel({ model_id, isOpen, setIsOpen }: Props) {
    const [loading, setLoading] = useState(false);
    const handleDelete = () => {
        router.delete(deleteModel({ model_id: model_id }).url, {
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
                        Hapus Model
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus Model ini?
                        Tindakan ini tidak dapat dibatalkan dan dapat
                        memengaruhi data mobil yang terkait dengan Model.
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

