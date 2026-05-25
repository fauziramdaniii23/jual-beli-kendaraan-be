import { X } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogClose
} from '@/components/ui/dialog';

interface ImageData {
    id: string | number;
    preview: string;
    file: {
        name: string
    };
}

interface ImagePreviewProps {
    image_src: string;
    file_name: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImagePreview({image_src, file_name, isOpen, onClose}: ImagePreviewProps) {

    return (
        <>
            {/* Image Detail Dialog */}
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-3xl border-0 bg-transparent p-4">
                    <DialogClose
                        className="absolute -right-10 -top-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                        <X className="h-6 w-6" />
                    </DialogClose>

                    <div className="flex flex-col items-center justify-center gap-4">
                        {/* Image */}
                        <img
                            src={image_src}
                            alt={file_name}
                            className="h-auto max-h-[70vh] w-auto rounded-lg object-contain"
                        />

                        {/* File Name */}
                        <div className="w-full text-center">
                            <p className="text-sm font-medium text-white">
                                {file_name}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
