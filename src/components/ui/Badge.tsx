import React from 'react';
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
  children?: React.ReactNode;
  className?: string;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-[#f1f5f9] text-[#0f172a]",
    success: "bg-[#d1fae5] text-[#065f46]",
    warning: "bg-[#fef3c7] text-[#92400e]",
    error: "bg-[#ffe4e6] text-[#9f1239]",
    outline: "border border-[#e2e8f0] text-[#1e293b]"
  };

  return (
    <div ref={ref} className={cn("inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props} />
  )
});
Badge.displayName = "Badge";
