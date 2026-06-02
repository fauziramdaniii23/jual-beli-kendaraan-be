import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Percent } from 'lucide-react';
import React from 'react';
import { index as indexPromo, store as storePromo, update as updatePromo } from '@/actions/App/Http/Controllers/News/PromoController';
import DatePicker from '@/components/app/date-picker';
import TextEditor from '@/components/app/text-editor';
import Title from '@/components/app/title';
import FormImage from '@/components/customers/reviews/form-image';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from '@/components/ui/spinner';
import { TYPE_LABEL } from '@/const/constant';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';

type TPromo = {
    promo_id: number;
    name: string;
    code: string;
    type: string;
    discount_value: number;
    description: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    image_name: string;
    image_src: string;
    image_file: File | null;
}

type PageProps = {
    promo: TPromo;
    type: 'detail' | 'create' | 'update';
};

const defaultPromo = {
    promo_id: 0,
    name: '',
    code: '',
    type: '',
    discount_value: 0,
    description: '',
    start_date: '',
    end_date: '',
    is_active: false,
    image_file: null,
}

export default function FormPromoPage() {
    const { promo, type } = usePage<PageProps>().props;
    const form = useForm<TPromo>(promo ?? defaultPromo);

    const disable = type === 'detail';
    const [selectType, setSelectType] = React.useState<string>('');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = type === 'update' ? updatePromo(promo.promo_id!).url : storePromo().url;

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
    const handleGenerateCode = () => {
        const promoName = form.data.name || '';

        const code = promoName
            .toUpperCase()
            .trim()
            .replace(/\s+/g, '_')      // spasi -> _
            .replace(/[^A-Z0-9_]/g, ''); // hapus karakter khusus

        form.setData('code', code);
    };

    return (
        <>
            <Head title={`${TYPE_LABEL[type]} Promo`} />
            <Title title={`${TYPE_LABEL[type]} Promo`} description={`Form ${TYPE_LABEL[type]} Promo`} />
            <div className="m-4">
                <form onSubmit={submit} className="space-y-4">
                    <FormImage
                        type={type}
                        data={{image_id: promo?.promo_id, image_name: promo?.image_name, image_src: promo?.image_src}}
                        uploadImage={(file) => handleUploadImage(file)}
                        removedImage={() => {} }
                    />
                    <div className="flex gap-4 w-full mt-4">
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Nama Promo<span className="text-destructive">*</span></FieldLabel>
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
                                    <FieldLabel>Tipe Diskon<span className="text-destructive">*</span></FieldLabel>
                                    <Select
                                        name="type"
                                        value={form.data.type || ''}
                                        onValueChange={(val) => {
                                            setSelectType(val);
                                            form.setData('type', val)
                                        }}
                                    >
                                        <SelectTrigger className="w-full input" aria-invalid={!!form.errors.type} disabled={disable}>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Tipe Diskon</SelectLabel>
                                                <SelectItem value="percentage">Persentase</SelectItem>
                                                <SelectItem value="fixed">Fix</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {form.errors.type && <div className="text-sm text-destructive">{form.errors.type}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Tanggal Mulai<span className="text-destructive">*</span></FieldLabel>
                                    <DatePicker
                                        value={form.data.start_date || ''}
                                        onChange={(val) => form.setData('start_date', val)}
                                        invalid={!!form.errors.start_date}
                                        disabled={disable}
                                    />
                                    {form.errors.start_date && <div className="text-sm text-destructive">{form.errors.start_date}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Deskripsi</FieldLabel>
                                    <TextEditor
                                        value={form.data.description || ''}
                                        onChange={(val) => form.setData('description', val)}
                                        disabled={disable}
                                    />
                                </Field>
                            </FieldGroup>
                        </div>
                        <div className="flex-1">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Kode Promo<span className="text-destructive">*</span></FieldLabel>
                                    <ButtonGroup>
                                        <Input
                                            name="code"
                                            value={form.data.code || ''}
                                            onChange={(e) => form.setData('code', e.target.value)}
                                            className="w-full input"
                                            aria-invalid={!!form.errors.code}
                                            disabled={disable}
                                        />
                                        <Button type="button" onClick={handleGenerateCode}>Generate</Button>
                                    </ButtonGroup>
                                    {form.errors.code && <div className="text-sm text-destructive">{form.errors.code}</div>}
                                </Field>
                                <Field>
                                    <FieldLabel>Nilai Diskon<span className="text-destructive">*</span></FieldLabel>
                                    <InputGroup className="w-full input">
                                        <InputGroupInput
                                            name="discount_value"
                                            type="number"
                                            value={form.data.discount_value}
                                            onChange={(e) => form.setData('discount_value', e.target.value === '' ? undefined as any : Number(e.target.value) as any)}
                                        />
                                        { selectType === 'fixed' ? (
                                            <InputGroupAddon>
                                                Rp.
                                            </InputGroupAddon>
                                        ) : (
                                            <InputGroupAddon align="inline-end"><Percent /></InputGroupAddon>
                                        )}
                                    </InputGroup>
                                </Field>
                                <Field>
                                    <FieldLabel>Tanggal Berakhir</FieldLabel>
                                    <DatePicker
                                        value={form.data.end_date || ''}
                                        onChange={(val) => form.setData('end_date', val)}
                                        invalid={!!form.errors.end_date}
                                        disabled={disable}
                                    />
                                    {form.errors.end_date && <div className="text-sm text-destructive">{form.errors.end_date}</div>}
                                </Field>
                                <Field>
                                    <Label>Status</Label>
                                    <Select
                                        value={form.data.is_active.toString()}
                                        onValueChange={(val) =>
                                            form.setData('is_active', val === 'true')
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="true">Aktif</SelectItem>
                                                <SelectItem value="false">Tidak Aktif</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </FieldGroup>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => router.get(indexPromo().url, {}, { preserveState: true, replace: true} )}
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

FormPromoPage.layout = (page: React.ReactElement<PageProps>) => {
    const pageProps = (page.props as PageProps | undefined) ?? undefined;
    const breadcrumbTitle = pageProps?.type ? TYPE_LABEL[pageProps?.type] : '';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'News', href: '#' },
                { title: 'Promo', href: indexPromo() },
                { title: `${breadcrumbTitle} Promo`, href: '#' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
