import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_URL = "https://resai.us";
export const CONTACT_EMAIL_PARTS = ["foxglobe2023", "gmail.com"] as const;
export const WECHAT_ID = "StarryNightSecret";
