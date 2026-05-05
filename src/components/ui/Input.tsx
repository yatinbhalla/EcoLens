import React from 'react';
import { cn } from "../../lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-[#E5E1D8] dark:border-slate-800 bg-[#FDFBF7] dark:bg-slate-900 px-4 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6B8E23] dark:focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-[#1A2E22] dark:text-slate-100 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
