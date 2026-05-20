import { Upload, X } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageFile {
    id: string;
    file: File;
    preview: string;
}

interface ImageUploadProps {
    onImagesSelected?: (files: File[]) => void;
    maxImages?: number;
    maxFileSize?: number; // in MB
}

export function ImageUpload({
        onImagesSelected,
        maxImages = 10,
        maxFileSize = 5,
    }: ImageUploadProps) {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [error, setError] = useState<string>('');

    const validateFile = (file: File): boolean => {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            setError('Hanya file gambar yang diizinkan');

            return false;
        }

        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);

        if (fileSizeMB > maxFileSize) {
            setError(`Ukuran file maksimal ${maxFileSize}MB`);

            return false;
        }

        return true;
    };

    const handleFiles = useCallback(
        (files: FileList) => {
            setError('');

            const newImages: ImageFile[] = [];

            // Convert FileList to Array and filter
            Array.from(files).forEach((file) => {
                if (!validateFile(file)) {
                    return;
                }

                // Check if image already added
                if (images.some((img) => img.file.name === file.name)) {
                    setError('Gambar dengan nama yang sama sudah ditambahkan');

                    return;
                }

                // Create preview URL
                const preview = URL.createObjectURL(file);
                newImages.push({
                    id: `${file.name}-${Date.now()}`,
                    file,
                    preview,
                });
            });

            // Check total limit
            if (images.length + newImages.length > maxImages) {
                setError(`Maksimal ${maxImages} gambar`);

                return;
            }

            const updatedImages = [...images, ...newImages];
            setImages(updatedImages);

            // Call callback with files
            if (onImagesSelected) {
                onImagesSelected(updatedImages.map((img) => img.file));
            }
        },
        [images, maxImages, onImagesSelected]
    );

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragActive(false);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFiles(e.dataTransfer.files);
            }
        },
        [handleFiles]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const removeImage = (id: string) => {
        const imageToRemove = images.find((img) => img.id === id);

        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview);
        }

        const updatedImages = images.filter((img) => img.id !== id);
        setImages(updatedImages);

        if (onImagesSelected) {
            onImagesSelected(updatedImages.map((img) => img.file));
        }
    };

    const clearAll = () => {
        images.forEach((img) => {
            URL.revokeObjectURL(img.preview);
        });
        setImages([]);
        setError('');

        if (onImagesSelected) {
            onImagesSelected([]);
        }
    };

    return (
        <div className="w-full">
            {/* Upload Area */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                    'relative rounded-lg border-2 border-dashed transition-colors',
                    isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 bg-muted/50 hover:border-muted-foreground/50'
                )}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Upload gambar"
                />

                <div className="flex flex-col items-center justify-center gap-3 px-6 py-12">
                    <div className={cn(
                        'rounded-full p-3 transition-colors',
                        isDragActive ? 'bg-primary/20' : 'bg-muted'
                    )}>
                        <Upload
                            className={cn(
                                'h-6 w-6 transition-colors',
                                isDragActive ? 'text-primary' : 'text-muted-foreground'
                            )}
                        />
                    </div>

                    <div className="text-center">
                        <p className="font-medium text-foreground">
                            Drag dan drop gambar di sini
                        </p>
                        <p className="text-sm text-muted-foreground">
                            atau klik untuk memilih gambar
                        </p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        {`Maksimal ${maxImages} gambar, ukuran max ${maxFileSize}MB`}
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-2 text-sm text-destructive">{error}</p>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="font-medium text-foreground">
                            {images.length} {images.length === 1 ? 'gambar' : 'gambar'}
                        </p>
                        {images.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearAll}
                                type="button"
                            >
                                Hapus Semua
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className="group relative overflow-hidden rounded-lg border border-muted-foreground/25"
                            >
                                {/* Image */}
                                <img
                                    src={image.preview}
                                    alt={image.file.name}
                                    className="h-24 w-full object-cover transition-transform group-hover:scale-105"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40" />

                                {/* Delete Button */}
                                <button
                                    onClick={() => removeImage(image.id)}
                                    className="absolute right-1 top-1 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
                                    aria-label={`Hapus ${image.file.name}`}
                                    type="button"
                                >
                                    <X className="h-4 w-4 text-white" />
                                </button>

                                {/* File Name */}
                                <p className="absolute bottom-0 w-full truncate bg-black/50 px-2 py-1 text-xs text-white">
                                    {image.file.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
