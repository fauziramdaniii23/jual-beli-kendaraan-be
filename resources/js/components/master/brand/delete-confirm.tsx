import { router } from "@inertiajs/react";
import { destroy as deleteBrand } from '@/actions/App/Http/Controllers/Master/MasterBrandController';
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

interface Props {
    brand_id: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}
export function ConfirmDeleteBrand({ brand_id, isOpen, setIsOpen }: Readonly<Props>) {
    const handleDelete = () => {
        router.delete(deleteBrand({ brand: brand_id }).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
            },
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Merek</AlertDialogTitle>

                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus Merek ini? Tindakan
                        ini tidak dapat dibatalkan dan dapat memengaruhi data
                        mobil yang terkait dengan Merek.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>

                    <AlertDialogAction onClick={handleDelete}>
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

