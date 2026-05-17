import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { update as updateModel } from '@/actions/App/Http/Controllers/Master/MasterModelController';
import type { TBrand } from '@/components/master/brand/type';
import type { TModel } from '@/components/master/model/type';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
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

interface Props {
    model: TModel;
    brands: TBrand[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function UpdateModelDialog({ model, brands, isOpen, setIsOpen }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        model_name: '',
        brand_id: '',
        is_active: 'false',
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setData({
            model_name: model.model_name,
            brand_id: String(model.brand_id),
            is_active: model.is_active ? 'true' : 'false',
        });
    }, [model, isOpen, setData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(updateModel({ model_id: model.model_id }).url, {
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
                        <DialogTitle>Update Model</DialogTitle>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="model_name">Nama Model</Label>
                            <Input
                                id="model_name"
                                name="model_name"
                                value={data.model_name}
                                onChange={(e) =>
                                    setData('model_name', e.target.value)
                                }
                            />
                            {errors.model_name && (
                                <p className="text-sm text-red-500">
                                    {errors.model_name}
                                </p>
                            )}
                        </Field>
                        <Field>
                            <Label>Merek</Label>
                            <Select
                                value={String(data.brand_id)}
                                onValueChange={(value) =>
                                    setData('brand_id', String(value))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Merek" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {brands.map((brand) => (
                                            <SelectItem
                                                key={brand.brand_id}
                                                value={String(brand.brand_id)}
                                            >
                                                {brand.brand_name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <Label>Status</Label>
                            <Select
                                value={data.is_active}
                                onValueChange={(value) =>
                                    setData('is_active', value)
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
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
