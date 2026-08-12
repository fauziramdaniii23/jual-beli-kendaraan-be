import { File, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadedFile {
    id: string;
    file: File;
    preview?: string;
}

interface FileUploadProps {
    onFilesSelected?: (files: File[]) => void;
    accept?: string[];
    maxFiles?: number;
    maxFileSize?: number;
    multiple?: boolean;
}

export function FileUpload({
    onFilesSelected,
    accept = ['image/*', '.pdf', 'doc', 'docx'],
    maxFiles = 10,
    maxFileSize = 5,
    multiple = true,
}: FileUploadProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [error, setError] = useState('');

    const acceptValue = accept.join(',');

    const isFileTypeAllowed = (file: File): boolean => {
        if (!accept.length) {
            return true;
        }

        return accept.some((type) => {
            if (type.endsWith('/*')) {
                const baseType = type.replace('/*', '');

                return file.type.startsWith(`${baseType}/`);
            }

            if (type.includes('/')) {
                return file.type === type;
            }

            return file.name.toLowerCase().endsWith(type.toLowerCase());
        });
    };

    const validateFile = (file: File): boolean => {
        // Check file type
        if (!isFileTypeAllowed(file)) {
            setError(
                `Tipe file tidak diizinkan. File yang diperbolehkan: ${accept.join(
                    ', ',
                )}`,
            );

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
        (fileList: FileList) => {
            setError('');

            const newFiles: UploadedFile[] = [];

            Array.from(fileList).forEach((file) => {
                if (!validateFile(file)) {
                    return;
                }

                // Check duplicate file
                if (
                    files.some(
                        (existingFile) =>
                            existingFile.file.name === file.name &&
                            existingFile.file.size === file.size,
                    )
                ) {
                    setError(`File "${file.name}" sudah ditambahkan`);

                    return;
                }

                const id = `${Date.now()}-${Math.random()}`;

                /**
                 * Hanya membuat object URL untuk file yang
                 * memang bisa di-preview sebagai image.
                 */
                const preview = file.type.startsWith('image/')
                    ? URL.createObjectURL(file)
                    : undefined;

                newFiles.push({
                    id,
                    file,
                    preview,
                });
            });

            if (!newFiles.length) {
                return;
            }

            const totalFiles = files.length + newFiles.length;

            if (totalFiles > maxFiles) {
                setError(`Maksimal ${maxFiles} file`);

                return;
            }

            const updatedFiles = [...files, ...newFiles];

            setFiles(updatedFiles);

            onFilesSelected?.(updatedFiles.map((item) => item.file));
        },
        [files, maxFiles, maxFileSize, accept, onFilesSelected],
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

            if (e.dataTransfer.files?.length) {
                handleFiles(e.dataTransfer.files);
            }
        },
        [handleFiles],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            handleFiles(e.target.files);
        }

        // Reset supaya file yang sama bisa dipilih lagi
        e.target.value = '';
    };

    const removeFile = (id: string) => {
        const fileToRemove = files.find((item) => item.id === id);

        if (fileToRemove?.preview) {
            URL.revokeObjectURL(fileToRemove.preview);
        }

        const updatedFiles = files.filter((item) => item.id !== id);

        setFiles(updatedFiles);

        onFilesSelected?.(updatedFiles.map((item) => item.file));
    };

    const clearAll = () => {
        files.forEach((item) => {
            if (item.preview) {
                URL.revokeObjectURL(item.preview);
            }
        });

        setFiles([]);
        setError('');

        onFilesSelected?.([]);
    };

    /**
     * Cleanup object URL ketika component unmount.
     */
    useEffect(() => {
        return () => {
            files.forEach((item) => {
                if (item.preview) {
                    URL.revokeObjectURL(item.preview);
                }
            });
        };
    }, []);

    const isImage = (file: File) => {
        return file.type.startsWith('image/');
    };

    const formatFileSize = (size: number) => {
        if (size < 1024) {
            return `${size} B`;
        }

        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(1)} KB`;
        }

        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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
                        : 'border-muted-foreground/25 bg-muted/50 hover:border-muted-foreground/50',
                )}
            >
                <input
                    type="file"
                    multiple={multiple}
                    accept={acceptValue}
                    onChange={handleChange}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Upload file"
                />

                <div className="flex flex-col items-center justify-center gap-3 px-6 py-12">
                    <div
                        className={cn(
                            'rounded-full p-3 transition-colors',
                            isDragActive ? 'bg-primary/20' : 'bg-muted',
                        )}
                    >
                        <Upload
                            className={cn(
                                'h-6 w-6 transition-colors',
                                isDragActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground',
                            )}
                        />
                    </div>

                    <div className="text-center">
                        <p className="font-medium text-foreground">
                            Drag dan drop file di sini
                        </p>

                        <p className="text-sm text-muted-foreground">
                            atau klik untuk memilih file
                        </p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Maksimal {maxFiles} file, ukuran max {maxFileSize}MB
                    </p>

                    <p className="text-xs text-muted-foreground">
                        Format: {accept.join(', ')}
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

            {/* Files */}
            {files.length > 0 && (
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="font-medium text-foreground">
                            {files.length} file
                        </p>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearAll}
                            type="button"
                        >
                            Hapus Semua
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {files.map((item) => (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden rounded-lg border border-muted-foreground/25"
                            >
                                {/* Image Preview */}
                                {isImage(item.file) && item.preview ? (
                                    <img
                                        src={item.preview}
                                        alt={item.file.name}
                                        className="h-24 w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    /* Generic File */
                                    <div className="flex h-24 w-full flex-col items-center justify-center gap-2 bg-muted">
                                        <File className="h-8 w-8 text-muted-foreground" />

                                        <span className="text-xs font-medium text-muted-foreground">
                                            {item.file.name
                                                .split('.')
                                                .pop()
                                                ?.toUpperCase()}
                                        </span>
                                    </div>
                                )}

                                {/* Delete */}
                                <button
                                    onClick={() => removeFile(item.id)}
                                    className="absolute top-1 right-1 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
                                    aria-label={`Hapus ${item.file.name}`}
                                    type="button"
                                >
                                    <X className="h-4 w-4 text-white" />
                                </button>

                                {/* File Information */}
                                <div className="bg-black/50 px-2 py-1 text-white">
                                    <p className="truncate text-xs">
                                        {item.file.name}
                                    </p>

                                    <p className="text-[10px] text-white/70">
                                        {formatFileSize(item.file.size)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
