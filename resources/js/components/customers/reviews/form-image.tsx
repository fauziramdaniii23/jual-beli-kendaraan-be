import { useMemo, useState } from 'react';
import { ImageUpload } from '@/components/app/image-upload';
import { ExistingImage } from '@/components/inventory/stock-unit/existing-image';
import type { TFormReviews } from '@/pages/customers/form-reviews';
import type { TImageProps } from '@/types';

type Props = {
    type: 'detail' | 'create' | 'update';
    data: TFormReviews;
    uploadImage: (file: File) => void;
    removedImage: (id: number) => void;
};

export default function FormImage({ type, data, uploadImage, removedImage}: Props) {

    const images: TImageProps[] = useMemo(() => {
        if (!data || !data.image_name) {
            return [];
        }

        return [
            {
                image_id: data.review_id ?? 0,
                image_name: data.image_name ?? '',
                image_src: data.image_src ?? '',
            },
        ];
    }, [data]);

    const [hasImage, setHasImage] = useState<boolean>(images.length > 0);

    const handleUploadImage = (file: File) => {
        uploadImage(file);
    };

    const handleRemoveImage = (id: number) => {
        removedImage(id);
        setHasImage(false);
    }

    return (
        <>
            {hasImage ? (
                <ExistingImage
                    images={images}
                    removeImage={(id) => handleRemoveImage(id)}
                    type={type}
                />
            ) : (
                <ImageUpload
                    onImagesSelected={(files) => handleUploadImage(files[0]) }
                    maxImages={1}
                    maxFileSize={5}
                />
            )}
        </>
    );
}
