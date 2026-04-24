"use client";
import React from "react";

interface ToggleProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}

export const Toggle = ({ options, value, onChange }: ToggleProps) => {
  return (
    <div className='flex p-1 bg-gray-100 rounded-xl w-full'>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            value === opt.value
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
