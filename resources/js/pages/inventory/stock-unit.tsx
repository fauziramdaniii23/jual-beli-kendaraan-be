import { router } from '@inertiajs/react';
import { Head, usePage } from '@inertiajs/react';
import { ChevronDownIcon, Plus, Filter
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { index as indexStockUnit } from '@/actions/App/Http/Controllers/inventory/StockUnitController';
import { stockUnitColumns } from '@/components/inventory/stock-unit/stock-unit-column';
import type { TStockUnitOptions, TUnit } from '@/components/inventory/stock-unit/type';
import { defaultUnit } from '@/components/inventory/stock-unit/type';
import { SelectWithClear } from '@/components/select-with-clear';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DataTable } from '@/components/ui/data-table/data-table';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';

type PageProps = {
    stock_unit: TUnit[];
    options: TStockUnitOptions;
};

export default function StockUnitPage() {
    const { stock_unit, options } = usePage<PageProps>().props;
    const [unit, seTUnit] = useState<TUnit>(defaultUnit);

    const [selectBrand, setSelectBrand] = useState<string>('');
    const [selectModel, setSelectModel] = useState<string>('');
    const [selectCarType, setSelectCarType] = useState<string>('');
    const [selectTransmission, setSelectTransmission] = useState<string>('');
    const [selectFuelType, setSelectFuelType] = useState<string>('');
    const [selectStatus, setSelectStatus] = useState<string>('');

    const filteredModels = useMemo(() => {
        return options.model.filter(
            (m) => !selectBrand || String(m.brand_id) === selectBrand
        );
    }, [options.model, selectBrand]);

    const submitFilter = () => {
        router.get(
            indexStockUnit().url,
            {
                brand_id: selectBrand === '' ? undefined : selectBrand,
                model_id: selectModel === '' ? undefined : selectModel,
                car_type: selectCarType === '' ? undefined : selectCarType,
                transmission: selectTransmission === '' ? undefined : selectTransmission,
                fuel_type: selectFuelType === '' ? undefined : selectFuelType,
                status: selectStatus === '' ? undefined : selectStatus,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };
    const handleBrandChange = (val: string) => {
        setSelectBrand(val);
        setSelectModel(''); // Reset model selection when brand changes
    }

    return (
        <>
            <Head title="Brand" />
            <div className="m-4 border rounded-md">
                <Collapsible className="rounded-md data-[state=open]:bg-muted">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="group w-full">
                            <Filter /> Filter
                            <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
                        <form className="w-full" onSubmit={(e) => {
                            e.preventDefault();
                            submitFilter();
                        }}>
                            <Separator />
                            <div className="flex gap-4 w-full mt-4">
                                <div className="flex-1">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="">
                                                Merek
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Merek"
                                                value={selectBrand}
                                                onChange={handleBrandChange}
                                                items={options.brand}
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="">
                                                Type
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Type"
                                                value={selectCarType}
                                                onChange={(val) => setSelectCarType(val)}
                                                items={options.car_type} />
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="">
                                                Transmisi
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Transmisi"
                                                value={selectTransmission}
                                                onChange={(val) => setSelectTransmission(val)}
                                                items={options.transmission} />
                                        </Field>
                                    </FieldGroup>
                                </div>

                                <div className="flex-1">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="">
                                                Model
                                            </FieldLabel>
                                            <SelectWithClear
                                                placeholder="Pilih Model" value={selectModel}
                                                onChange={(val) => setSelectModel(val)}
                                                items={filteredModels.map(m => ({ label: m.label, value: String(m.value) }))} />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                                Bahan Bakar
                                            </FieldLabel>
                                            <SelectWithClear placeholder="Pilih Bahan Bakar" value={selectFuelType} onChange={(val) => setSelectFuelType(val)} items={options.fuel_type} />
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                                Status
                                            </FieldLabel>
                                            <SelectWithClear placeholder="Pilih Status" value={selectStatus} onChange={(val) => setSelectStatus(val)} items={options.status} />
                                        </Field>
                                    </FieldGroup>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <CollapsibleTrigger asChild>
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </CollapsibleTrigger>
                                <Button type="submit">Filter</Button>
                            </div>
                        </form>
                    </CollapsibleContent>
                </Collapsible>
            </div>

            <div className="mx-4">
                <Button>
                    <Plus />
                    Tambah Stock Unit Baru
                </Button>
            </div>
            <div className="m-4">
                <DataTable columns={stockUnitColumns} data={stock_unit} />
            </div>
        </>
    );
}

StockUnitPage.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
        },
        {
            title: 'Stock Unit',
        },
    ],
};
