import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Convert USDC amount (e.g., 1.5) to smallest unit (e.g., 1500000)
export function usdcToSmallestUnit(amount) {
  return Math.round(Number(amount) * 1_000_000);
}

// Convert "YYYY-MM-DD" to UNIX timestamp for 23:59:59 of that day
export function dateToEndOfDayUnix(dateStr) {
  const date = new Date(dateStr + "T23:59:59");
  return Math.floor(date.getTime() / 1000);
}
