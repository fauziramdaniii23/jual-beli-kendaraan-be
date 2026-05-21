import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    loading?: boolean;
}

export function ConfirmDeleteDialog({
    open,
    onOpenChange,
    title = "Hapus Data",
    description = "Apakah Anda yakin ingin menghapus data ini?",
    confirmText = "Hapus",
    cancelText = "Batal",
    onConfirm,
    loading = false,
}: Readonly<Props>) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        {cancelText}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
