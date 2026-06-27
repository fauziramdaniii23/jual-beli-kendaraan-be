
import type { TCustomer } from '@/components/customers/customer/type';
import type { TMasterReference } from '@/types';

export type TSellSubmission = {
    sell_submission_id?: number;
    customer_id?: number;
    brand?: string;
    model?: string;
    variant?: string;
    year?: number;
    kilometer?: number;
    status_code: string;
    inspection_date?: string;
    expectation_price?: number;
    final_price?: number;
    status?: TMasterReference;
    customer?: TCustomer;
};

export const defaultSellSubmission: TSellSubmission = {
    status_code: 'NEW',
};

