import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';
import { store as storeCustomer } from '@/actions/App/Http/Controllers/Customer/CustomerController';
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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

export default function CreateCstomerDialog() {
    const [isOpen, setIsOpen] = React.useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(storeCustomer().url, {
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
                    Tambah Customer Baru
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Tambah Customer Baru</DialogTitle>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <FieldLabel>Nama<span className="text-red-600">*</span></FieldLabel>
                            <Input
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                required
                            />
                            {errors.name && (<p className="text-sm text-red-500">{errors.name}</p>)}
                        </Field>
                        <Field>
                            <FieldLabel>No Handphone<span className="text-red-600">*</span></FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    value={data.phone}
                                    onChange={(e) => setData("phone", e.target.value)}
                                    type="number" />
                                <InputGroupAddon>
                                    +62
                                </InputGroupAddon>
                            </InputGroup>
                            {errors.phone && (<p className="text-sm text-red-500">{errors.phone}</p>)}
                        </Field>
                        <Field>
                            <FieldLabel>Email<span className="text-red-600">*</span></FieldLabel>
                            <Input
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                required
                            />
                            {errors.name && (<p className="text-sm text-red-500">{errors.name}</p>)}
                        </Field>
                        <Field>
                            <FieldLabel>Alamat <span className="text-neutral-500">(opsional)</span></FieldLabel>
                            <Textarea
                                value={data.address}
                                onChange={(e) => setData("address", e.target.value)}
                                required
                            />
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
