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
export type TOptionItem = {
    value: string;
    label: string;
};
export type TImagesFile = {
    image_id: number;
    cars_id: number;
    file_name: string;
    path: string;
    file_src: string;
    is_primary: boolean;
};
