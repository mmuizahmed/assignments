import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const le = cn;
export const Zu = clsx;

export function publicAsset(file) {
  return `${import.meta.env.BASE_URL}${String(file).replace(/^\//, "")}`;
}

export const LOGO = publicAsset("assets/logo.6lrMPvRL.png");
export const WHATSAPP = publicAsset("assets/whatsapp.DnA-7nei.png");
export const COVER = publicAsset("cover-image.png");

export const SESSION_KEY = "lms_user";
export const THEME_KEY = "theme";
export const INTENDED_KEY = "intendedRoute";
