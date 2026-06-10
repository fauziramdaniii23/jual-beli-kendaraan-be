import { Head, router, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { index as indexUser, store as storeUser, update as updateUser } from '@/actions/App/Http/Controllers/Otentikasi/UserController';
import ImagePreview from '@/components/app/image-preview';
import Title from '@/components/app/title';
import { AvatarUpload } from '@/components/otentikasi/user/avatar-upload';
import { Button } from '@/components/ui/button';
import {
    Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList, ComboboxValue
} from '@/components/ui/combobox';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { TYPE_LABEL } from '@/const/constant';
import AppLayout from '@/layouts/app-layout';
import type { TImageProps } from '@/types';

type TRoles = {
    id: number;
    name: string;
}
export type TFormUser = {
    id: number;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number?: string;
    avatar?: File | null | string;
    avatar_src?: string;
    data_roles?: string[];
}

type PageProps = {
    roles: TRoles[];
    user: TFormUser;
    type: 'detail' | 'create' | 'update';
};

const defaultUser = {
    id: 0,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone_number: '',
    avatar: null,
    data_roles: [],
}

export default function FormUserPage() {
    const { roles, user, type } = usePage<PageProps>().props;
    const label = TYPE_LABEL[type];
    const form = useForm<TFormUser>(user ?? defaultUser);
    const disable = type === 'detail';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = type === 'update' && user ? updateUser(user.id!).url : storeUser().url;

        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
            }
        })
    };

    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
    const imagePreview: TImageProps[] = [
        {
            image_id: form.data.id,
            image_src: form.data.avatar_src,
            image_name: form.data.name
        }
    ]

    return (
        <>
            <Head title={`${label} User`} />
            <Title title={`${label} User`} description={`Form ${label} User`} />
            <div className="m-4">
                <form onSubmit={submit} className="space-y-4">
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
                                    <FieldLabel htmlFor="phone_number">No Telepon</FieldLabel>

                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        type="number"
                                        value={form.data.phone_number}
                                        onChange={(e) =>
                                            form.setData('phone_number', e.target.value)
                                        }
                                    />
                                    {form.errors.phone_number && (<p className="text-sm text-red-500">{form.errors.phone_number}</p>)}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={form.data.password}
                                        onChange={(e) =>
                                            form.setData('password', e.target.value)
                                        }
                                        aria-invalid={!!form.errors.password}
                                        disabled={disable}
                                    />
                                    {form.errors.password && (<p className="text-sm text-red-500">{form.errors.password}</p>)}
                                </Field>
                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">Email<span className="text-destructive">*</span></FieldLabel>

                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        aria-invalid={!!form.errors.email}
                                        value={form.data.email}
                                        disabled={disable}
                                        onChange={(e) =>
                                            form.setData('email', e.target.value)
                                        }
                                    />
                                    {form.errors.email && (<p className="text-sm text-red-500">{form.errors.email}</p>)}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="roles">Roles</FieldLabel>
                                    <Combobox
                                        items={roles}
                                        multiple
                                        value={form.data.data_roles}
                                        onValueChange={(val) => form.setData('data_roles', val as string[])}
                                        disabled={disable}
                                    >
                                        <ComboboxChips>
                                            <ComboboxValue>
                                                {form.data.data_roles?.map((roleId) => {
                                                    const role = roles.find((r) => String(r.id) === String(roleId));

                                                    return role ? (
                                                        <ComboboxChip key={role.id}>{role.name}</ComboboxChip>
                                                    ) : null;
                                                })}
                                            </ComboboxValue>
                                            <ComboboxChipsInput placeholder="Tambah Role" />
                                        </ComboboxChips>
                                        <ComboboxContent>
                                            <ComboboxEmpty>No items found.</ComboboxEmpty>
                                            <ComboboxList>
                                                {(item) => (
                                                    <ComboboxItem key={item.id} value={String(item.id)}>
                                                        {item.name}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                    {form.errors.data_roles && (<p className="text-sm text-red-500">{form.errors.data_roles}</p>)}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password_confirmation">Password Confirmation</FieldLabel>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        value={form.data.password_confirmation}
                                        onChange={(e) =>
                                            form.setData('password_confirmation', e.target.value)
                                        }
                                        aria-invalid={!!form.errors.password_confirmation}
                                        disabled={disable}
                                    />
                                    {form.errors.password_confirmation && (<p className="text-sm text-red-500">{form.errors.password_confirmation}</p>)}
                                </Field>

                            </FieldGroup>
                        </div>
                        <div className="flex flex-1 items-center justify-center">
                            <AvatarUpload
                                value={form.data.avatar as File}
                                onChange={(file) => form.setData('avatar', file)}
                                disabled={disable}
                                userName={form.data.name}
                                avatarSrc={user?.avatar_src}
                                onPreview={() =>setIsPreviewOpen(true)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => router.get(indexUser().url, {}, { preserveState: true, replace: true} )}
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
            <ImagePreview
                currentIndex={0}
                images={imagePreview}
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
            />
        </>
    );
}

FormUserPage.layout = (page: React.ReactElement<PageProps>) => {
    const pageProps = (page.props as PageProps | undefined) ?? undefined;
    const breadcrumbTitle = pageProps?.type ? TYPE_LABEL[pageProps?.type] : '';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Otentikasi', href: '#' },
                { title: 'Users', href: indexUser() },
                { title: `${breadcrumbTitle} User`, href: '#' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
