import type { TCustomer } from '@/components/customers/customer/type';
import type { TOrder } from '@/components/customers/orders/types';
import type { TUnit } from '@/components/inventory/stock-unit/type';

export type TSalesInvoice = {
    sales_invoice_id?: string;
    invoice_date?: string | null;
    customer_id: number | null;
    car_id: number | null;
    order_id: number | null;
    final_price?: number;
    notes?: string;
    customer?: TCustomer;
    unit?: TUnit;
    order?: TOrder;
    files?: TSalesInvoiceFile[];
    upload_files?: File[] | null;
    deleted_file_ids?: number[] | null;
};

export type TSalesInvoiceFile = {
    sales_invoice_file_id: number;
    sales_invoice_id: number;
    file_name: string;
    file_path: string;
    file_type: string;
};
