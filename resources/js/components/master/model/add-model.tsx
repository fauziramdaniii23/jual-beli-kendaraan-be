import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';
import { store as storeModel } from '@/actions/App/Http/Controllers/Master/CarModelController';
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
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    brands: TBrand[];
}
export default function CreateModelDialog({ brands }: Props) {
    const [isOpen, setIsOpen] = React.useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        model_name: '',
        brand_id: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(storeModel().url, {
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
                    Tambah Model Baru
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Tambah Model Baru</DialogTitle>
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
