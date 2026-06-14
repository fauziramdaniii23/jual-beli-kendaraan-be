import type { TCustomer } from '@/components/customers/customer/type';
import type { TUnit } from '@/components/inventory/stock-unit/type';
import type { TMasterReference } from '@/types';

export type TOrder = {
    order_id: number
    order_uuid: string
    car_id: number
    customer_id: number
    status_code: string;
    type_paid_code: string;
    unit?: TUnit;
    customer?: TCustomer;
    status?: TMasterReference;
    typePaid?: TMasterReference;
}

export const defaultOrder: TOrder = {
    order_id: 0,
    order_uuid: '',
    car_id: 0,
    customer_id: 0,
    status_code: '',
    type_paid_code: '',
}
