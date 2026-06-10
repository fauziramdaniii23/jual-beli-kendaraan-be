import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import type { TImageProps } from '@/types';


interface ImagePreviewProps {
    images: TImageProps[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImagePreview({ images, currentIndex, isOpen, onClose, }: ImagePreviewProps) {

    const [activeIndex, setActiveIndex] = useState(currentIndex);

    const nextImage = useCallback(() => {
        if (images.length <= 1) {
            return;
        }

        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const prevImage = useCallback(() => {
        if (images.length <= 1) {
            return;
        }

        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowRight':
                    nextImage();
                    break;

                case 'ArrowLeft':
                    prevImage();
                    break;

                case 'Escape':
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, nextImage, prevImage, onClose]);

    if (!images.length) {
        return null;
    }

    const currentImage = images[activeIndex];

    if (!currentImage) {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl border-0 bg-transparent p-4 shadow-none">
                <DialogTitle className="sr-only">
                    Preview Image
                </DialogTitle>

                <DialogClose className="absolute -right-2 -top-2 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
                    <X className="h-5 w-5" />
                </DialogClose>

                <div className="relative flex items-center justify-center">
                    {/* Previous Button */}
                    {images.length > 1 && (
                        <button
                            type="button"
                            onClick={prevImage}
                            className="absolute left-2 z-20 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                            aria-label="Previous Image"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    )}

                    {/* Image */}
                    <img
                        src={currentImage.image_src}
                        alt={currentImage.image_name}
                        className="max-h-[80vh] w-auto rounded-lg object-contain"
                    />

                    {/* Next Button */}
                    {images.length > 1 && (
                        <button
                            type="button"
                            onClick={nextImage}
                            className="absolute right-2 z-20 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                            aria-label="Next Image"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 flex flex-col items-center gap-1 text-center text-white">
                    <p className="max-w-full truncate text-sm font-medium">
                        {currentImage.image_name}
                    </p>

                    <p className="text-xs text-white/70">
                        {activeIndex + 1} / {images.length}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
