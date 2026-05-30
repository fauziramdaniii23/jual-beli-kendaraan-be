import { Head, router, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { index as indexBranch, store as storeBranch, update as updateBranch } from '@/actions/App/Http/Controllers/Master/MasterBranchController';
import FormImage from '@/components/customers/reviews/form-image';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { TYPE_LABEL } from '@/const/constant';
import AppLayout from '@/layouts/app-layout';


export type TFormBranch = {
    branch_id?: number;
    name: string;
    address: string;
    map_link: string;
    phone: string;
    image_file?: File | null | string;
    image_src?: string;
    image_name?: string;
}

type PageProps = {
    branch: TFormBranch;
    type: 'detail' | 'create' | 'update';
};

const defaultBranch = {
    branch_id: 0,
    name: '',
    address: '',
    map_link: '',
    phone: '',
    image_file: null,
}

export default function FormBranchPage() {
    const { branch, type } = usePage<PageProps>().props;
    const form = useForm<TFormBranch>(branch ?? defaultBranch);
    const disable = type === 'detail';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = type === 'update' ? updateBranch(branch.branch_id!).url : storeBranch().url;

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
            <Head title={`${TYPE_LABEL[type]} Cabang`} />
            <div className="m-4">
                <form onSubmit={submit} className="space-y-4">
                    <FormImage
                        type={type}
                        data={{image_id: branch?.branch_id, image_name: branch?.image_name, image_src: branch?.image_src}}
                        uploadImage={(file) => handleUploadImage(file)}
                        removedImage={(id) => console.log('removedImage', id) }
                    />
                    <div className="flex gap-4 w-full mt-4">
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Nama<span className="text-destructive">*</span></FieldLabel>
                                    <Input
                                        name="name"
                                        value={form.data.name || ''}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        className="w-full input"
                                        aria-invalid={!!form.errors.name}
                                        disabled={disable}
                                    />
                                    {form.errors.name && <div className="text-sm text-destructive">{form.errors.name}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="map_link">Maps URL</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            name="map_link"
                                            placeholder="example.com"
                                            value={form.data.map_link}
                                            onChange={(e) => form.setData('map_link', e.target.value)}
                                            className="w-full input"
                                            aria-invalid={!!form.errors.map_link}
                                            disabled={disable}
                                        />
                                        <InputGroupAddon>
                                            <InputGroupText>https://</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {form.errors.map_link && <div className="text-sm text-destructive">{form.errors.map_link}</div>}
                                </Field>
                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>

                                <Field>
                                    <FieldLabel>No Telepon</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            name="phone"
                                            placeholder="85x xxx xxxx"
                                            type="number"
                                            value={form.data.phone || ''}
                                            onChange={(e) => form.setData('phone', e.target.value)}
                                            className="w-full input"
                                            aria-invalid={!!form.errors.phone}
                                            disabled={disable}
                                        />
                                        <InputGroupAddon>
                                            <InputGroupText>62</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>

                                    {form.errors.phone && <div className="text-sm text-destructive">{form.errors.phone}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Alamat<span className="text-destructive">*</span></FieldLabel>
                                    <Textarea
                                        name="address"
                                        value={form.data.address || ''}
                                        onChange={(e) => form.setData('address', e.target.value)}
                                        className="w-full input"
                                        aria-invalid={!!form.errors.address}
                                        disabled={disable}
                                    />
                                    {form.errors.address && <div className="text-sm text-destructive">{form.errors.address}</div>}
                                </Field>

                            </FieldGroup>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => router.get(indexBranch().url, {}, { preserveState: true, replace: true} )}
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

FormBranchPage.layout = (page: React.ReactElement<PageProps>) => {
    const pageProps = (page.props as PageProps | undefined) ?? undefined;
    const breadcrumbTitle = pageProps?.type ? TYPE_LABEL[pageProps?.type] : '';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Customer', href: '#' },
                { title: 'Rating & Ulasan', href: indexBranch() },
                { title: `${breadcrumbTitle} Rating & Ulasan`, href: '#' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
