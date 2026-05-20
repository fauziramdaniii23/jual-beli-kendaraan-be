// resources/js/components/inventory/stock-unit/add-stock-unit.tsx
import { useForm } from '@inertiajs/react';
import React, { useMemo } from 'react';
import { SelectWithClear } from '@/components/select-with-clear';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { defaultUnit   } from './type';
import type {TUnit, TStockUnitOptions} from './type';

type Props = {
  options: TStockUnitOptions;
  initial?: Partial<TUnit>;
  onClose?: () => void;
};

export default function AddStockUnit({ options, initial = {}, onClose }: Props) {
  const form = useForm<TUnit>({
    ...defaultUnit,
    ...initial,
  });

  // keep model list filtered by selected brand
  const filteredModels = useMemo(() => {
    return options.model.filter((m) => !form.data.brand_id || String(m.brand_id) === String(form.data.brand_id));
  }, [options.model, form.data.brand_id]);

  const handleBrandChange = (val: string) => {
    form.setData('brand_id', val === '' ? undefined as any : val as any);
    form.setData('model_id', ''); // reset model when brand changes
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Nama / Label</FieldLabel>
          <input
            value={form.data.name || ''}
            onChange={(e) => form.setData('name', e.target.value)}
            className="w-full input"
          />
          {form.errors.name && <div className="text-sm text-destructive">{form.errors.name}</div>}
        </Field>

        <Field>
          <FieldLabel>Merek</FieldLabel>
          <SelectWithClear
            placeholder="Pilih Merek"
            value={String(form.data.brand_id ?? '')}
            onChange={handleBrandChange}
            items={options.brand}
          />
          {form.errors.brand_id && <div className="text-sm text-destructive">{form.errors.brand_id}</div>}
        </Field>

        <Field>
          <FieldLabel>Model</FieldLabel>
          <SelectWithClear
            placeholder="Pilih Model"
            value={String(form.data.model_id ?? '')}
            onChange={(val) => form.setData('model_id', val === '' ? undefined as any : val as any)}
            items={filteredModels.map((m) => ({ label: m.label, value: String(m.value) }))}
          />
          {form.errors.model_id && <div className="text-sm text-destructive">{form.errors.model_id}</div>}
        </Field>

        <Field>
          <FieldLabel>Tipe</FieldLabel>
          <SelectWithClear
            placeholder="Pilih Tipe"
            value={String(form.data.type_code ?? '')}
            onChange={(val) => form.setData('type_code', val === '' ? undefined as any : val as any)}
            items={options.car_type}
          />
          {form.errors.type_code && <div className="text-sm text-destructive">{form.errors.type_code}</div>}
        </Field>

        <Field>
          <FieldLabel>Transmisi</FieldLabel>
          <SelectWithClear
            placeholder="Pilih Transmisi"
            value={String(form.data.transmission_code ?? '')}
            onChange={(val) => form.setData('transmission_code', val === '' ? undefined as any : val as any)}
            items={options.transmission}
          />
          {form.errors.transmission_code && <div className="text-sm text-destructive">{form.errors.transmission_code}</div>}
        </Field>

        <Field>
          <FieldLabel>Bahan Bakar</FieldLabel>
          <SelectWithClear
            placeholder="Pilih Bahan Bakar"
            value={String(form.data.fuel_type_code ?? '')}
            onChange={(val) => form.setData('fuel_type_code', val === '' ? undefined as any : val as any)}
            items={options.fuel_type}
          />
          {form.errors.fuel_type_code && <div className="text-sm text-destructive">{form.errors.fuel_type_code}</div>}
        </Field>

        <Field>
          <FieldLabel>Status</FieldLabel>
          <SelectWithClear
            placeholder="Pilih Status"
            value={String(form.data.status ?? '')}
            onChange={(val) => form.setData('status', val === '' ? undefined as any : val as any)}
            items={options.status}
          />
          {form.errors.status && <div className="text-sm text-destructive">{form.errors.status}</div>}
        </Field>
      </FieldGroup>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => (onClose ? onClose() : window.history.back())}>
          Batal
        </Button>
        <Button type="submit" disabled={form.processing}>
          Simpan
        </Button>
      </div>
    </form>
  );
}
