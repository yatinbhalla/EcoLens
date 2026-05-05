import React, { useState } from 'react';
import { cn } from "../../lib/utils";

export function Tooltip({ children, content, className }: { children: React.ReactNode, content: React.ReactNode, className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn("absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-max max-w-xs px-3 py-1.5 text-xs text-white bg-slate-900 rounded-md shadow-md", className)}>
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  );
}
