export type * from './auth';
export type * from './navigation';
export type * from './ui';

export type TMasterReference = {
    ref_id: number;
    ref_type: string;
    ref_code: string;
    ref_value: string;
    is_active: boolean;
}
