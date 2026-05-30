import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Star } from 'lucide-react';
import React from 'react';
import { index as indexReviews, store as storeReviews, update as updateReviews } from '@/actions/App/Http/Controllers/Customer/ReviewsController';
import TextEditor from '@/components/app/text-editor';
import FormImage from '@/components/customers/reviews/form-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList
} from '@/components/ui/combobox';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { TYPE_LABEL } from '@/const/constant';
import AppLayout from '@/layouts/app-layout';

type TUnit = {
    cars_id: number;
    name: string;
    status: {
        ref_code: string;
        ref_value: string;
    }
}
type TCustomer = {
    id: number;
    name: string;
}

export type TFormReviews = {
    review_id?: number;
    cars_id: number;
    user_id: number;
    user: TCustomer;
    unit: TUnit;
    rating: number;
    review_text: string;
    is_published: boolean;
    image_file?: File | null | string;
    image_src?: string;
    image_name?: string;
}

type PageProps = {
    units: TUnit[];
    users: TCustomer[];
    reviews: TFormReviews;
    type: 'detail' | 'create' | 'update';
};

const defaultReviews = {
    review_id: 0,
    cars_id: 0,
    user_id: 0,
    rating: '',
    review_text: '',
    image_file: null,
}

export default function FormReviewPage() {
    const { units, users, reviews, type } = usePage<PageProps>().props;
    const form = useForm<TFormReviews>(reviews ?? defaultReviews);
    const disable = type === 'detail';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = type === 'update' ? updateReviews(reviews.review_id!).url : storeReviews().url;

        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
            }
        })
    };

    const handleUploadImage = (file: File | null) => {
        form.setData('image_file', file)
    }

    return (
        <>
            <Head title={`${TYPE_LABEL[type]} Rating & Ulasan`} />
            <div className="m-4">
                <form onSubmit={submit} className="space-y-4">
                    <FormImage
                        type={type}
                        data={{image_id: reviews?.review_id, image_name: reviews?.image_name, image_src: reviews?.image_src}}
                        uploadImage={(file) => handleUploadImage(file)}
                        removedImage={(id) => console.log('removedImage', id) }
                    />
                    <div className="flex gap-4 w-full mt-4">
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Nama<span className="text-destructive">*</span></FieldLabel>
                                    {type === 'detail' || type === 'update' ? (
                                        <Input
                                            name="name"
                                            value={form.data.user.name || ''}
                                            className="w-full input"
                                            disabled={true}
                                        />
                                    ) : (
                                        <Combobox
                                            items={users}
                                            itemToStringLabel={(item : TCustomer) => item.name}
                                            onValueChange={(val : TCustomer | null) => form.setData('user_id', Number(val?.id))}
                                        >
                                            <ComboboxInput placeholder="Pilih Customer" showClear/>

                                            <ComboboxContent>
                                                <ComboboxEmpty>Customer tidak ditemukan.</ComboboxEmpty>

                                                <ComboboxList>
                                                    {(user) => (
                                                        <ComboboxItem
                                                            key={user.id}
                                                            value={user}
                                                        >
                                                            {user.name}
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                    )}
                                </Field>
                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>

                                <Field>
                                    <FieldLabel>Unit<span className="text-destructive">*</span></FieldLabel>
                                    {type === 'detail' || type === 'update' ? (
                                        <Input
                                            name="unit"
                                            value={form.data.unit.name || ''}
                                            className="w-full input"
                                            disabled={true}
                                        />
                                    ) : (
                                        <Combobox
                                            items={units}
                                            itemToStringLabel={(item : TUnit) => item.name}
                                            onValueChange={(val : TUnit | null) => form.setData('cars_id', Number(val?.cars_id))}
                                        >
                                            <ComboboxInput placeholder="Pilih Unit" showClear/>

                                            <ComboboxContent>
                                                <ComboboxEmpty>Unit tidak ditemukan.</ComboboxEmpty>

                                                <ComboboxList>
                                                    {(unit) => (
                                                        <ComboboxItem
                                                            key={unit.cars_id}
                                                            value={unit}
                                                        >
                                                            {unit.name}
                                                            <Badge variant={unit.status.ref_code.toLowerCase()}>
                                                                {unit.status.ref_value}
                                                            </Badge>
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                    )}
                                </Field>

                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <Field>
                                <FieldLabel>Rating</FieldLabel>

                                <Select
                                    name="rating"
                                    value={form.data.rating?.toString()}
                                    onValueChange={(val) =>
                                        form.setData('rating', Number(val))
                                    }
                                    disabled={disable}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Rating" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Rating</SelectLabel>
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <SelectItem
                                                    key={rating}
                                                    value={rating.toString()}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex">
                                                            {Array.from({ length: 5 }).map((_, index) => (
                                                                <Star
                                                                    key={index}
                                                                    className={`h-4 w-4 ${
                                                                        index < rating
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>

                                                        <span className="text-sm">
                                                                ({rating})
                                                            </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                        {
                            type !== 'create' && (
                                <div className="flex-1">
                                    <Field>
                                        <FieldLabel>Status Publish</FieldLabel>

                                        <Select
                                            name="status"
                                            value={form.data.is_published.toString()}
                                            onValueChange={(val) => form.setData('is_published', val === 'true')}
                                            disabled={disable}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Status</SelectLabel>
                                                    <SelectItem value="true">Published</SelectItem>
                                                    <SelectItem value="false">Not Publish</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>
                            )
                        }
                    </div>
                    <Field>
                        <FieldLabel>Ulasan</FieldLabel>
                        <TextEditor
                            value={form.data.review_text || ''}
                            onChange={(val) => form.setData('review_text', val)}
                            disabled={disable}
                        />
                    </Field>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => router.get(indexReviews().url, {}, { preserveState: true, replace: true} )}
                            type="button"
                            variant="outline">
                            {disable ? 'Kembali' : 'Batal'}
                        </Button>
                        { !disable &&
                            <Button type="submit" disabled={form.processing}>
                                {form.processing && <Spinner />}
                                {form.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        }
                    </div>
                </form>
            </div>
        </>
    );
}

FormReviewPage.layout = (page: React.ReactElement<PageProps>) => {
    const pageProps = (page.props as PageProps | undefined) ?? undefined;
    const breadcrumbTitle = pageProps?.type ? TYPE_LABEL[pageProps?.type] : '';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Customer', href: '#' },
                { title: 'Rating & Ulasan', href: indexReviews() },
                { title: `${breadcrumbTitle} Rating & Ulasan`, href: '#' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
