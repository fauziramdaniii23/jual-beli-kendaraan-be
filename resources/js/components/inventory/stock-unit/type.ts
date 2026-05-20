import type { TOptionItem, TMasterReference } from '@/types';

export type TUnit = {
    cars_id: number;
    name: string;
    description?: string | null;
    brand_id: string | number;
    model_id: string | number;
    type_code?: string | null;
    transmission_code?: string | null;
    fuel_type_code?: string | null;
    plate_code?: string | null;
    seat_code?: string | null;
    status_code?: string | null;
    status?: TMasterReference;
    kilometer?: number | null;
    year?: number | null;
    engine_cc?: number | null;
    color?: string | null;
    price?: number | null;
    stnk_validity_period?: string | null;
    is_active: boolean;
}
export type TOptionItemModel = {
    value: string | number;
    label: string;
    brand_id?: number; // Optional, only for model options
}
export type TStockUnitOptions = {
    brand: TOptionItem[];
    model: TOptionItemModel[];
    transmission: TOptionItem[];
    fuel_type: TOptionItem[];
    car_type: TOptionItem[];
    status: TOptionItem[];
};

export const defaultUnit: TUnit = {
    cars_id: 0,
    name: '',
    description: null,
    brand_id: 0,
    model_id: 0,
    type_code: null,
    transmission_code: null,
    fuel_type_code: null,
    kilometer: 0,
    year: null,
    price: 0,
    is_active: true,
};
