import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';
import { store } from '@/actions/App/Http/Controllers/News/FAQController';
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
    DialogTrigger
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { TMasterReference, TOptionItem } from '@/types';
import { SelectWithClear } from '@/components/app/select-with-clear';

type Props = {
    categories: TMasterReference[]
}
export default function CreateFaqDialog({categories}: Props) {
    const [isOpen, setIsOpen] = React.useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<TFaq>({
        question: '',
        answer: '',
        category_code: '',
        sort_order: 0,
        is_published: false,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(store().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    const OptionCategories: TOptionItem[] = categories.map(category => ({
        label : category.ref_value,
        value : category.ref_code

    }))

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Tambah FAQ Baru
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[80vw]">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Tambah FAQ Baru</DialogTitle>
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
                                items={OptionCategories}
                                invalid={!!errors.category_code}
                            />
                            {errors.category_code &&
                                <div className="text-sm text-destructive">{errors.category_code}</div>}
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
