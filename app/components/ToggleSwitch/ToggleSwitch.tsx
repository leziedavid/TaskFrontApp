// ToggleSwitch.tsx
import React from 'react';

interface ToggleSwitchProps {
    isChecked: boolean;
    onChange: () => void;
    className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onChange, className }) => {
    return (
        <label className={`autoSaverSwitch relative inline-flex cursor-pointer select-none items-center ${className}`}>
            <input
                type='checkbox'
                className='sr-only'
                checked={isChecked}
                onChange={onChange}
            />
            <span
                className={`slider mr-3 flex h-[25px] w-[50px] items-center rounded-full p-1 duration-200 ${isChecked ? 'bg-[#038C4C]' : 'bg-[#CCCCCE]'}`}
            >
                <span
                    className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${isChecked ? 'translate-x-6' : ''}`}
                ></span>
            </span>
        </label>
    );
};

export default ToggleSwitch;
