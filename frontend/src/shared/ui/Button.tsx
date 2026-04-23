import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  isLoading,
  ...props
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-200 hover:from-indigo-700 hover:to-violet-700 shadow-lg",
    secondary:
      "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
  };

  return (
    <button
      {...props}
      disabled={isLoading}
      className={`
        relative w-full py-3 cursor-pointer px-4 rounded-xl font-semibold transition-all 
        duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
        ${variants[variant]}
      `}
    >
      {isLoading ? (
        <div className='flex items-center justify-center gap-2'>
          <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
