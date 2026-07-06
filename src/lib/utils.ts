import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toPersianNumber(val: number | string | undefined | null, options?: Intl.NumberFormatOptions): string {
  if (val === undefined || val === null) return '';
  
  if (typeof val === 'number') {
    return val.toLocaleString('fa-IR', options);
  }
  
  const trimmed = val.toString().trim();
  const parsed = Number(trimmed);
  if (!isNaN(parsed) && trimmed !== '') {
    return parsed.toLocaleString('fa-IR', options);
  }
  
  // For strings with mixed text and numbers (e.g., dates or units)
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return val.toString().replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}
