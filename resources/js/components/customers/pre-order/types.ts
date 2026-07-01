import type { TCustomer } from '@/components/customers/customer/type';
import type { TMasterReference } from '@/types';

export type TPreOrder = {
    pre_order_id?: number;
    customer_id?: number;
    brand?: string;
    model?: string;
    variant?: string;
    year?: number;
    kilometer?: number;
    status_code: string;
    expectation_price?: number;
    status?: TMasterReference;
    customer?: TCustomer;
};

export const defaultPreOrder: TPreOrder = {
    status_code: 'NEW',
};
