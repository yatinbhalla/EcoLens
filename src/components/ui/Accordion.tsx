import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from "../../lib/utils";

interface AccordionProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({ title, children, defaultOpen = false, className }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b border-[#E5E1D8] last:border-0", className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 transition-transform duration-200" /> : <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />}
      </button>
      <div
        className={cn(
          "overflow-hidden text-sm transition-all duration-200 ease-in-out",
          isOpen ? "max-h-[2000px] pb-4 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}
