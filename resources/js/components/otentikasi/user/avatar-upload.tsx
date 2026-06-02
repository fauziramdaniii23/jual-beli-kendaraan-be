import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';

interface AvatarUploadProps {
    value: File | string | null;
    onChange: (file: File | null) => void;
    disabled?: boolean;
    currentAvatar?: string;
    userName?: string;
    avatarSrc?: string | null;
    onPreview: () => void
}

export function AvatarUpload({
     value,
     onChange,
     disabled = false,
     currentAvatar,
     userName = 'User',
    avatarSrc = null,
    onPreview
 }: AvatarUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(avatarSrc);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Silakan pilih file gambar');

                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB');

                return;
            }

            onChange(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        onChange(null);
        setPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const displayImage = preview || (typeof value === 'string' ? value : null) || currentAvatar;

    return (
        <Field>
            <div className="flex flex-col items-center gap-4">
                <Avatar onClick={onPreview} className="w-24 h-24">
                    {displayImage && <AvatarImage src={displayImage} alt={userName} />}
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                    >
                        Pilih Avatar
                    </Button>
                    {(displayImage || value) && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleRemove}
                            disabled={disabled}
                        >
                            Hapus
                        </Button>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={disabled}
                    className="hidden"
                    aria-label="Upload avatar"
                />

                {value instanceof File && (
                    <p className="text-sm text-muted-foreground">
                        File: {value.name}
                    </p>
                )}
            </div>
        </Field>
    );
}
