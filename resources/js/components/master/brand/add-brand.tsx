import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';
import { store as storeBrand } from '@/actions/App/Http/Controllers/Master/MasterBrandController';
import type { TBrand } from '@/components/master/brand/type';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function CreateBrandDialog() {
    const [isOpen, setIsOpen] = React.useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<TBrand>({
        brand_name: '',
        logo: null
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(storeBrand().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Tambah Merek Baru
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Tambah Merek Baru</DialogTitle>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="brand_name">Nama Merek</Label>

                            <Input
                                id="brand_name"
                                name="brand_name"
                                value={data.brand_name}
                                onChange={(e) =>
                                    setData('brand_name', e.target.value)
                                }
                            />

                            {errors.brand_name && (
                                <p className="text-sm text-red-500">
                                    {errors.brand_name}
                                </p>
                            )}
                        </Field>
                        <Field>
                            <Label htmlFor="brand_name">Gambar Logo</Label>

                            <Input
                                id="logo"
                                name="logo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;

                                    setData("logo", file);
                                }}
                            />

                            {errors.brand_name && (
                                <p className="text-sm text-red-500">
                                    {errors.brand_name}
                                </p>
                            )}
                            <FieldDescription>
                                Format: JPG, JPEG, PNG, WEBP. Maksimal 2MB. Gunakan gambar dengan rasio 1:1 untuk hasil tampilan terbaik.
                            </FieldDescription>
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
