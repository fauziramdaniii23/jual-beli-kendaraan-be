import React from 'react';
import { Input } from '@/components/ui/input';

type NumberFormatInputProps = {
    value: number | null | undefined;
    onChange: (value: number) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
    invalid?: boolean
    disable?: boolean
};

export function NumberFormatInput({ value, onChange, placeholder, required, className, invalid, disable}: NumberFormatInputProps) {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');

        onChange(rawValue ? Number(rawValue) : 0);
    };

    return (
        <Input
            type="text"
            value={value ? formatNumber(value) : ''}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            className={className}
            aria-invalid={invalid}
            disabled={disable}
            inputMode="numeric"
        />
    );
}
