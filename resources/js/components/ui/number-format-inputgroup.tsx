import React from 'react';
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from '@/components/ui/input-group';

type InputGroupNumberFormatProps = {
    value: number | null | undefined;
    onChange: (value?: number) => void;
    prefix?: string;
    disable?: boolean;
    className?: string;
    invalid?: boolean;
    alignPrefix?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end' | null | undefined
};

export function InputGroupNumberFormat({ value, onChange, prefix = 'Rp.', disable, className, invalid, alignPrefix }: InputGroupNumberFormatProps) {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');

        onChange(raw === '' ? undefined : Number(raw));
    };

    return (
        <InputGroup>
            <InputGroupInput
                type="text"
                inputMode="numeric"
                value={value != null ? formatNumber(value) : ''}
                onChange={handleChange}
                disabled={disable}
                className={className}
                aria-invalid={invalid}
            />

            <InputGroupAddon align={alignPrefix} >
                {prefix}
            </InputGroupAddon>
        </InputGroup>
    );
}
