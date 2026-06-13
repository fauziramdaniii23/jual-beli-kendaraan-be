import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { update as updateCustomer } from '@/actions/App/Http/Controllers/Customer/CustomerController';
import type { TCustomer } from '@/components/customers/customer/type';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
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
import { Textarea } from '@/components/ui/textarea';

interface Props {
    customer: TCustomer;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function UpdateCustomerDialog({ customer, isOpen, setIsOpen }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        is_active: 'false',
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setData({
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            address: customer.address,
            is_active: customer.is_active ? 'true' : 'false',
        });
    }, [customer, isOpen, setData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(updateCustomer(customer.customer_id).url, {
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
                        <DialogTitle>Update Customer</DialogTitle>
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
