import React from 'react';

interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    ref?: React.Ref<HTMLInputElement>;
}

const OtpInput = React.forwardRef<HTMLInputElement, OtpInputProps>(function OtpInput({ value, onChange }, ref) {
    return (
        <input
            ref={ref}
            type="text"
            maxLength={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 shadow-sm outline-none focus:border-orange-600 focus:ring-black"
        />
    );
});

export default OtpInput;
