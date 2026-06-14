import { Clock8Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimePickerProps {
    id?: string;
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    error?: string;
    className?: string;
    step?: number;
}

export function TimePicker({
       id,
       label,
       value,
       onChange,
       placeholder,
       required = false,
       disabled = false,
       readOnly = false,
       error,
       className,
       step = 60,
   }: TimePickerProps) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <Label htmlFor={id}>
                    {label}
                    {required && (
                        <span className="text-red-500 ml-1">*</span>
                    )}
                </Label>
            )}

            <div className="relative">
                <Input
                    id={id}
                    type="time"
                    value={value ?? ""}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    step={step}
                    onChange={(e) => onChange?.(e.target.value)}
                    className={cn(
                        error && "border-destructive",
                        className
                    )}
                />
            </div>

            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}
