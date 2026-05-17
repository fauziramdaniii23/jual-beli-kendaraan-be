import type { TBrand } from '@/components/master/brand/type';

export type TModel = {
    model_id: number;
    model_name: string;
    brand_id: number;
    brand: TBrand;
    is_active: boolean;
}
