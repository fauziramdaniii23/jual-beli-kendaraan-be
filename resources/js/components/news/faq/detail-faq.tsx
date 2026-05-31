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
                        <DialogTitle>Update FAQ</DialogTitle>
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
