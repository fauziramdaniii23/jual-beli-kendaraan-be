import { SelectWithClear } from '@/components/app/select-with-clear';
import TextEditor from '@/components/app/text-editor';
import type { TFaq } from '@/components/news/faq/type';
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
import { Label } from '@/components/ui/label';
import type { TOptionItem } from '@/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

interface Props {
    faq: TFaq;
    optionCategories: TOptionItem[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function DetailFaqDialog({ faq, optionCategories, isOpen, setIsOpen }: Props){

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[80vw]">
                    <DialogHeader>
                        <DialogTitle>Detail FAQ</DialogTitle>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="question">Pertanyaan ?<span className="text-destructive">*</span></Label>

                            <Input
                                id="question"
                                name="question"
                                value={faq.question}
                                disabled={true}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Jawaban<span className="text-destructive">*</span></FieldLabel>
                            <TextEditor
                                disabled={true}
                                value={faq.answer || ''}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Kategori<span className="text-destructive">*</span></FieldLabel>
                            <SelectWithClear
                                placeholder="Pilih Kategori"
                                value={faq.category_code ?? ''}
                                items={optionCategories}
                                onChange={() => {}}
                                disabled={true}
                            />
                        </Field>
                    </FieldGroup>
                <div className="w-full flex gap-4">
                    <Field className="flex-1">
                        <Label>Status Published</Label>
                        <Select
                            value={faq.is_published ? 'true' : 'false'}
                            disabled={true}
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
                    <Field className="flex-1">
                        <Label>Urutan FAQ</Label>
                        <Input
                            id="sort_order"
                            name="sort_order"
                            value={faq.sort_order}
                            type="number"
                            disabled={true}
                        />
                    </Field>
                </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Kembali
                            </Button>
                        </DialogClose>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
