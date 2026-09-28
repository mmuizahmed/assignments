import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const le = cn;
export const Zu = clsx;

export const LOGO = "/assets/logo.6lrMPvRL.png";
export const WHATSAPP = "/assets/whatsapp.DnA-7nei.png";
export const COVER = "/cover-image.png";

export const SESSION_KEY = "lms_user";
export const THEME_KEY = "theme";
export const INTENDED_KEY = "intendedRoute";
