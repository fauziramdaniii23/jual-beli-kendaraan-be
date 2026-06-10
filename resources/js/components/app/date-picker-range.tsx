import { format, parse } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import type { TDateRange } from '@/types';

interface Props {
    value?: TDateRange;
    onChange?: (value: TDateRange) => void;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
}

export default function DateRangePicker({
    value,
    onChange,
    placeholder = 'Pilih Rentang Tanggal',
    disabled,
    invalid,
}: Props) {
    const [open, setOpen] = React.useState(false);

    const date: DateRange | undefined =
        value?.from
            ? {
                from: parse(value.from, 'dd-MM-yyyy', new Date()),
                to: value.to
                    ? parse(value.to, 'dd-MM-yyyy', new Date())
                    : undefined,
            }
            : undefined;

    const handleSelect = (range: DateRange | undefined) => {
        if (!range?.from) {
            onChange?.({
                from: '',
                to: '',
            });

            return;
        }

        const from = format(range.from, 'dd-MM-yyyy');
        const to = range.to
            ? format(range.to, 'dd-MM-yyyy')
            : '';

        onChange?.({
            from,
            to,
        });

        // tutup popover setelah range lengkap dipilih
        if (range.from && range.to) {
            setOpen(false);
        }
    };

    const label = date?.from
        ? date.to
            ? `${format(date.from, 'dd-MM-yyyy')} - ${format(date.to, 'dd-MM-yyyy')}`
            : format(date.from, 'dd-MM-yyyy')
        : placeholder;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild aria-invalid={invalid}>
                <Button
                    variant="outline"
                    className="w-72 justify-between font-normal"
                    disabled={disabled}
                >
                    {label}
                    <ChevronDownIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
            >
                <Calendar
                    mode="range"
                    selected={date}
                    onSelect={handleSelect}
                    defaultMonth={date?.from}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );
}
