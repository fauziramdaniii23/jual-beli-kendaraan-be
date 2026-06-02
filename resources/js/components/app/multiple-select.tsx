import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type MultiSelectOption = {
    value: string;
    label: string;
};

interface MultiSelectProps {
    options: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    emptyText?: string;
    disabled?: boolean;
    className?: string;
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = 'Pilih data...',
    emptyText = 'Data tidak ditemukan',
    disabled,
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);

    const toggleOption = (optionValue: string) => {
        const exists = value.includes(optionValue);

        if (exists) {
            onChange(value.filter((v) => v !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
    };

    const removeOption = (optionValue: string) => {
        onChange(value.filter((v) => v !== optionValue));
    };

    const selectedOptions = options.filter((option) =>
        value.includes(option.value)
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                        'min-h-10 h-auto w-full justify-between',
                        className
                    )}
                >
                    <div className="flex flex-wrap gap-1">
                        {selectedOptions.length === 0 ? (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        ) : (
                            selectedOptions.map((option) => (
                                <Badge
                                    key={option.value}
                                    variant="secondary"
                                    className="gap-1"
                                >
                                    {option.label}

                                    <span
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeOption(option.value);
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </span>
                                </Badge>
                            ))
                        )}
                    </div>

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
            >
                <Command>
                    <CommandInput placeholder="Cari..." />

                    <CommandEmpty>
                        {emptyText}
                    </CommandEmpty>

                    <CommandGroup>
                        {options.map((option) => {
                            const selected = value.includes(option.value);

                            return (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() =>
                                        toggleOption(option.value)
                                    }
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            selected
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />

                                    {option.label}
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
