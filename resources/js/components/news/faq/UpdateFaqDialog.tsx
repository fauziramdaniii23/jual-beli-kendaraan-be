import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { update } from '@/actions/App/Http/Controllers/News/FAQController';
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
import { Spinner } from '@/components/ui/spinner';
import type { TOptionItem } from '@/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    faq: TFaq;
    optionCategories: TOptionItem[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function UpdateFaqDialog({ faq, optionCategories, isOpen, setIsOpen }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<TFaq>({
        question: '',
        answer: '',
        category_code: '',
        sort_order: 0,
        is_published: false,
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setData({
            question: faq.question,
            answer: faq.answer,
            category_code: faq.category_code,
            sort_order: faq.sort_order,
            is_published: faq.is_published,
        });
    }, [faq, isOpen, setData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(update({ faq: faq.faq_id! }).url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[80vw]">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Update FAQ</DialogTitle>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="question">Pertanyaan ?<span className="text-destructive">*</span></Label>

                            <Input
                                id="question"
                                name="question"
                                value={data.question}
                                onChange={(e) =>
                                    setData('question', e.target.value)
                                }
                            />

                            {errors.question && (
                                <p className="text-sm text-red-500">
                                    {errors.question}
                                </p>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel>Jawaban<span className="text-destructive">*</span></FieldLabel>
                            <TextEditor
                                value={data.answer || ''}
                                onChange={(val) => setData('answer', val)}
                            />
                            {errors.answer && (
                                <p className="text-sm text-red-500">
                                    {errors.answer}
                                </p>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel>Kategori<span className="text-destructive">*</span></FieldLabel>
                            <SelectWithClear
                                placeholder="Pilih Kategori"
                                value={data.category_code ?? ''}
                                onChange={(val) => setData('category_code', val === '' ? undefined as any : val as any)}
                                items={optionCategories}
                                invalid={!!errors.category_code}
                            />
                            {errors.category_code &&
                                <div className="text-sm text-destructive">{errors.category_code}</div>}
                        </Field>
                    </FieldGroup>
                    <div className="w-full flex gap-4">
                        <Field className="flex-1">
                            <Label>Status Published</Label>
                            <Select
                                value={data.is_published ? 'true' : 'false'}
                                onValueChange={(val) =>
                                    setData('is_published', val === 'true')
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
                        <Field className="flex-1">
                            <Label>Urutan FAQ</Label>
                            <Input
                                id="sort_order"
                                name="sort_order"
                                value={data.sort_order}
                                type="number"
                                onChange={(e) =>
                                    setData('sort_order', Number(e.target.value))
                                }
                            />
                        </Field>
                    </div>

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
