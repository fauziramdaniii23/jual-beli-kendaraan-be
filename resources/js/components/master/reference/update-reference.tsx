import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { update as updateReference } from '@/actions/App/Http/Controllers/Master/MasterReferenceController';
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
import type { TMasterReference } from '@/types';
import { Spinner } from '@/components/ui/spinner';

interface Props {
    label: string;
    reference: TMasterReference;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function UpdateReferenceDialog({ label, reference, isOpen, setIsOpen }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        ref_value: '',
        is_active: 'false',
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setData({
            ref_value: reference.ref_value,
            is_active: reference.is_active ? 'true' : 'false',
        });
    }, [reference, isOpen, setData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(updateReference({ id: reference.ref_id }).url, {
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
                        <DialogTitle>Update {label}</DialogTitle>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="ref_value">Nama {label}</Label>
                            <Input
                                id="ref_value"
                                name="ref_value"
                                value={data.ref_value}
                                onChange={(e) =>
                                    setData('ref_value', e.target.value)
                                }
                            />
                            {errors.ref_value && (
                                <p className="text-sm text-red-500">
                                    {errors.ref_value}
                                </p>
                            )}
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
                            {processing && <Spinner />}
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
