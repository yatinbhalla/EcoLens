import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScoreColor(score: number): string {
  if (score >= 80) return "text-[#10b981]";
  if (score >= 60) return "text-[#eab308]";
  return "text-[#f43f5e]";
}

export function formatScoreBg(score: number): string {
  if (score >= 80) return "bg-[#10b981]";
  if (score >= 60) return "bg-[#eab308]";
  return "bg-[#f43f5e]";
}

export function formatScoreBgSubtle(score: number): string {
    if (score >= 80) return "bg-[#d1fae5] text-[#047857] border-[#a7f3d0]";
    if (score >= 60) return "bg-[#fef3c7] text-[#a16207] border-[#fde68a]";
    return "bg-[#ffe4e6] text-[#be123c] border-[#fecdd3]";
}
