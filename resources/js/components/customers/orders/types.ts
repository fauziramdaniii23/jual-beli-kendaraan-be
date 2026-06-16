import type { TCustomer } from '@/components/customers/customer/type';
import type { TUnit } from '@/components/inventory/stock-unit/type';
import type { TBrand } from '@/components/master/brand/type';
import type { TModel } from '@/components/master/model/type';
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

export type TTradeIn = {
    trade_in_id?: number;
    car_id?: number;
    brand_id?: number
    model_id?: number
    order_id?: number
    variant?: string;
    year?: number;
    kilometer?: number
    status_code: string;
    inspection_date: string
    unit?: TUnit;
    brand?: TBrand;
    model?: TModel;
    order?: TOrder;
    status?: TMasterReference;
}

export const defaultOrder: TOrder = {
    order_id: 0,
    order_uuid: '',
    car_id: 0,
    customer_id: 0,
    status_code: '',
    type_paid_code: '',
}

export const defaultTradeIn: TTradeIn = {
    variant: '',
    status_code: 'NEW',
    inspection_date: ''
}
