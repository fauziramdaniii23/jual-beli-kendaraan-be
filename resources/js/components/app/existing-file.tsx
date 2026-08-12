import { File, X } from 'lucide-react';
import { useState } from 'react';

import { ConfirmDialog } from '@/components/app/confirm-dialog';
import ImagePreview from '@/components/app/image-preview';

interface TFileProps {
    file_id: number;
    file_name: string;
    file_src: string;
    file_type?: string;
}

interface Props {
    files: TFileProps[];
    removeFile: (id: number) => void;
    type?: 'update' | 'create' | 'detail';
}

export function ExistingFile({ files, removeFile, type }: Readonly<Props>) {
    const [existingFiles, setExistingFiles] = useState<TFileProps[]>(files);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const isImage = (file: TFileProps) => {
        if (file.file_type) {
            return file.file_type.startsWith('image/');
        }

        return /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(file.file_name);
    };

    /**
     * Handle click file.
     */
    const handleFileClick = (file: TFileProps, index: number) => {
        if (isImage(file)) {
            setSelectedIndex(index);
            setIsPreviewOpen(true);

            return;
        }

        /**
         * Untuk file non-image, buka file di tab baru.
         */
        window.open(file.file_src, '_blank');
    };

    /**
     * Handle delete button.
     */
    const handleDeleteClick = (id: number) => {
        setSelectedFileId(id);
        setIsDialogOpen(true);
    };

    /**
     * Confirm delete.
     */
    const handleConfirmDelete = () => {
        if (selectedFileId === null) {
            return;
        }

        const updatedFiles = existingFiles.filter(
            (file) => file.file_id !== selectedFileId,
        );

        setExistingFiles(updatedFiles);

        removeFile(selectedFileId);

        setSelectedFileId(null);
        setIsDialogOpen(false);
    };

    /**
     * Hanya image yang dikirim ke ImagePreview.
     */
    const previewImages = existingFiles
        .filter((file) => isImage(file))
        .map((file) => ({
            image_id: file.file_id,
            image_name: file.file_name,
            image_src: file.file_src,
        }));

    /**
     * Cari index image berdasarkan selected file.
     *
     * Karena ImagePreview hanya berisi image,
     * index harus berdasarkan daftar image, bukan
     * berdasarkan semua file.
     */
    const selectedImageIndex = (() => {
        if (selectedIndex < 0) {
            return 0;
        }

        const selectedFile = existingFiles[selectedIndex];

        if (!selectedFile || !isImage(selectedFile)) {
            return 0;
        }

        const imageIndex = existingFiles
            .filter((file) => isImage(file))
            .findIndex((file) => file.file_id === selectedFile.file_id);

        return imageIndex >= 0 ? imageIndex : 0;
    })();

    return (
        <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {existingFiles.map((file, index) => {
                    const imageFile = isImage(file);

                    return (
                        <div
                            key={file.file_id}
                            onClick={() => handleFileClick(file, index)}
                            className="group relative cursor-pointer overflow-hidden rounded-lg border border-muted-foreground/25"
                        >
                            {/* Preview */}
                            {imageFile ? (
                                <img
                                    src={file.file_src}
                                    alt={file.file_name}
                                    className="h-24 w-full object-cover transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-24 w-full flex-col items-center justify-center gap-2 bg-muted">
                                    <File className="h-8 w-8 text-muted-foreground" />

                                    <span className="max-w-[90%] truncate text-xs font-medium text-muted-foreground">
                                        {file.file_name
                                            .split('.')
                                            .pop()
                                            ?.toUpperCase()}
                                    </span>
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40" />

                            {/* Delete Button */}
                            {type !== 'detail' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        handleDeleteClick(file.file_id);
                                    }}
                                    className="absolute top-1 right-1 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
                                    aria-label={`Hapus ${file.file_name}`}
                                    type="button"
                                >
                                    <X className="h-4 w-4 text-white" />
                                </button>
                            )}

                            {/* File Name */}
                            <p className="absolute bottom-0 w-full truncate bg-black/50 px-2 py-1 text-xs text-white">
                                {file.file_name}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Confirm Delete */}
            <ConfirmDialog
                title="Hapus File"
                description="Apakah Anda yakin ingin menghapus file ini?"
                confirmText="Hapus"
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleConfirmDelete}
            />

            {/* Image Preview */}
            {previewImages.length > 0 && (
                <ImagePreview
                    images={previewImages}
                    currentIndex={selectedImageIndex}
                    isOpen={isPreviewOpen}
                    onClose={() => setIsPreviewOpen(false)}
                />
            )}
        </>
    );
}
