"use client";

import { IconSettings } from "@tabler/icons-react";

export default function CustomizeFab() {
  return (
    <button
      type="button"
      aria-label="Live Customize"
      className="fixed top-1/4 right-[10px] z-[1200] flex h-12 w-12 items-center justify-center overflow-hidden bg-berry-secondary text-white shadow-[0px_12px_14px_0px_rgba(124,77,255,0.3)]"
      style={{ borderRadius: "50% 50% 4px 50%" }}
    >
      <span
        className="flex h-[52px] w-[52px] animate-spin items-center justify-center"
        style={{ animationDuration: "2s" }}
      >
        <IconSettings size={24} stroke={2} />
      </span>
    </button>
  );
}
