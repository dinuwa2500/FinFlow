import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input = ({ label, icon, error, type, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className='flex flex-col gap-1.5 w-full'>
      {label && (
        <label className='text-sm font-semibold text-gray-700'>{label}</label>
      )}

      <div className='relative group'>
        {/* Left Icon */}
        {icon && (
          <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors'>
            {icon}
          </div>
        )}

        <input
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`
            w-full px-4 py-2.5 
            ${icon ? "pl-10" : "pl-4"} 
            ${isPassword ? "pr-10" : "pr-4"}
            bg-gray-50/50 border border-gray-200 rounded-xl 
            text-gray-900 placeholder:text-gray-400
            transition-all duration-200 ease-in-out
            hover:border-gray-300
            focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}
          `}
        />

        {/* Password Toggle Button */}
        {isPassword && (
          <button
            type='button'
            onClick={togglePassword}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <span className='text-xs text-red-500 font-medium'>{error}</span>
      )}
    </div>
  );
};

