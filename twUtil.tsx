import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

//combines clsx and twmerge

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}