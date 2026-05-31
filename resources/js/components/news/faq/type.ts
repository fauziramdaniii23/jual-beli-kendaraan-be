import type { TMasterReference } from '@/types';

export type TFaq = {
    faq_id?: number;
    question: string;
    answer: string;
    category_code?: string;
    category?: TMasterReference;
    is_published?: boolean;
    sort_order?: number;

}
