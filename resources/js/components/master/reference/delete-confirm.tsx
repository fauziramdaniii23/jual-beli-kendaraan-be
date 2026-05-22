import { router } from "@inertiajs/react";
import React, { useState } from 'react';
import { destroy as deleteReference } from '@/actions/App/Http/Controllers/Master/MasterReferenceController';
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
    label: string;
    ref_id: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}
export function ConfirmDeleteReference({ label, ref_id, isOpen, setIsOpen }: Props) {
    const [loading, setLoading] = useState(false);
    const handleDelete = () => {
        router.delete(deleteReference({ id: ref_id }).url, {
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
                        Hapus {label}
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus {label} ini?
                        Tindakan ini tidak dapat dibatalkan dan dapat
                        memengaruhi data mobil yang terkait dengan {label}.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Batal
                    </AlertDialogCancel>

                    <AlertDialogAction onClick={handleDelete} disabled={loading}>
                        {loading && <Spinner />}
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

