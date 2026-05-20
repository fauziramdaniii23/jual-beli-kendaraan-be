import { format, parse } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';

interface Props {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    startMonth?: Date;
    endMonth?: Date;
    disabled?: boolean;
}

export default function DatePicker({
   value,
   onChange,
   placeholder = 'Pilih Tanggal',
   startMonth,
   endMonth,
    disabled
}: Props) {
    const [open, setOpen] = React.useState(false);
    const [label, setLabel] = React.useState(value);

    // derived state
    const date = value
        ? parse(value, 'dd-MM-yyyy', new Date())
        : undefined;

    const handleSelectDate = (
        date: Date | undefined
    ) => {
        const formatted = date
            ? format(date, 'dd-MM-yyyy')
            : '';

        onChange?.(formatted);
        setLabel(formatted);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-52 justify-between font-normal"
                    disabled={disabled}
                >
                    {label || placeholder}

                    <ChevronDownIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
            >
                <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    defaultMonth={date}
                    onSelect={handleSelectDate}
                    startMonth={startMonth}
                    endMonth={endMonth}
                />
            </PopoverContent>
        </Popover>
    );
}
