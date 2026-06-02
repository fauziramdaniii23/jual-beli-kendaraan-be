import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

type SelectWithClearProps = {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    name?: string
    items: { label: string; value: string }[];
    disabled?: boolean;
    loading?: boolean;
    required?: boolean;
    invalid?: boolean;
};

export function SelectWithClear({
        value,
        onChange,
        placeholder = 'Select option',
        name,
        items,
        disabled = false,
        loading = false,
        required = false,
        invalid = false,
    }: SelectWithClearProps) {
    const isDisabled = disabled || loading;

    return (
        <div className="flex w-full items-center gap-2">
            <Select
                name={name}
                value={value}
                onValueChange={onChange}
                disabled={isDisabled}
                required={required}
            >
                <SelectTrigger className="w-full" aria-invalid={invalid}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        {items.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {value && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onChange('')}
                    disabled={isDisabled}
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <X className="h-4 w-4" />
                    )}
                </Button>
            )}
        </div>
    );
}
