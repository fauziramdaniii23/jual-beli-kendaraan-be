import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { update as updateBrand } from '@/actions/App/Http/Controllers/Master/MasterBrandController';
import type { TBrand } from '@/components/master/brand/type';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

interface Props {
    brand: TBrand;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function UpdateBrandDialog({ brand, isOpen, setIsOpen }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<TBrand>({
        brand_name: '',
        logo: null,
        is_active: false,
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setData({
            brand_name: brand.brand_name,
            is_active: brand.is_active,
        });
    }, [brand, isOpen, setData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(updateBrand({ brand: brand.brand_id! }).url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Update Merek</DialogTitle>
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

                        <Field>
                            <Label>Status</Label>
                            <Select
                                value={data.is_active ? 'true' : 'false'}
                                onValueChange={(val) =>
                                    setData('is_active', val === 'true')
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
