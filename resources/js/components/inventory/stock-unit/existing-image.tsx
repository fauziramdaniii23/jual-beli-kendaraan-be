import { X } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { TImagesFile } from '@/types';

interface Props {
    images: TImagesFile[];
    removeImage: (id: number) => void;
    type?: 'update' | 'create' | 'detail';
}

export function ExistingImage({images, removeImage, type}: Props) {
    const [existingImages, setExistingImages] = useState<TImagesFile[]>(images);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setSelectedImageId(id);
        setIsDialogOpen(true);
    }
    const handleConfirmDelete = () => {
        const updatedImages = existingImages.filter(image => image.image_id !== selectedImageId);
        setExistingImages(updatedImages);
        removeImage(selectedImageId!);
        setIsDialogOpen(false);
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {existingImages.map((image) => (
                    <div
                        key={image.image_id}
                        className="group relative overflow-hidden rounded-lg border border-muted-foreground/25"
                    >
                        {/* Image */}
                        <img
                            src={image.file_src}
                            alt={image.file_name}
                            className="h-24 w-full object-cover transition-transform group-hover:scale-105"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40" />

                        {/* Delete Button */}
                        {
                            type !== 'detail' && (
                                <button
                                    onClick={() => handleDeleteClick(image.image_id)}
                                    className="absolute right-1 top-1 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
                                    aria-label={`Hapus ${image.file_name}`}
                                    type="button"
                                >
                                    <X className="h-4 w-4 text-white" />
                                </button>
                            )
                        }

                        {/* File Name */}
                        <p className="absolute bottom-0 w-full truncate bg-black/50 px-2 py-1 text-xs text-white">
                            {image.file_name}
                        </p>
                    </div>
                ))}
            </div>
            <ConfirmDialog
                title="Hapus Gambar"
                description="Apakah Anda yakin ingin menghapus gambar ini?"
                confirmText="Hapus"
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
