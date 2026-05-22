import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';
import { store as storeReference } from '@/actions/App/Http/Controllers/Master/MasterReferenceController';
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
import { Spinner } from '@/components/ui/spinner';

interface Props {
    type: string;
    label: string;
}
export default function CreateTransmissionDialog({ type, label }: Props) {
    const [isOpen, setIsOpen] = React.useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        ref_type: type,
        ref_code: '',
        ref_value: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(storeReference({type: type}).url, {
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
                    Tambah {label} Baru
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Tambah {label} Baru</DialogTitle>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="ref_code">Kode {label}</Label>

                            <Input
                                id="ref_code"
                                name="ref_code"
                                value={data.ref_code}
                                onChange={(e) =>
                                    setData('ref_code', e.target.value)
                                }
                            />

                            {errors.ref_code && (
                                <p className="text-sm text-red-500">
                                    {errors.ref_code}
                                </p>
                            )}
                        </Field>
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
