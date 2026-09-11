"use client";

import { useState } from "react";
import { IconDots } from "@tabler/icons-react";
import { ArrowUpGlyph, EarningGlyph } from "./glyphs";

export default function EarningCard() {
  const [open, setOpen] = useState(false);

  return (
    <article className="relative h-[181px] overflow-hidden rounded-[8px] text-white" style={{ background: "rgba(98, 0, 234, 0.35)" }}>
      <span className="pointer-events-none absolute -top-[85px] -right-[95px] h-[210px] w-[210px] rounded-full bg-[#6200ea]" />
      <span className="pointer-events-none absolute -top-[125px] -right-[15px] h-[210px] w-[210px] rounded-full bg-[#6200ea] opacity-50" />
      <div className="relative p-[18px]">
        <div className="flex items-start justify-between">
          <div className="mt-2 flex h-10 w-10 items-center justify-center overflow-hidden rounded-[8px] bg-[#6200ea]">
            <EarningGlyph />
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label="More"
              onClick={() => setOpen((v) => !v)}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] bg-berry-secondary text-[#d1c4e9]"
            >
              <IconDots size={20} />
            </button>
            {open ? (
              <div className="absolute top-10 right-0 z-10 w-[160px] rounded-[8px] bg-berry-card py-2 text-[14px] text-berry-text shadow-[0px_5px_5px_-3px_rgba(0,0,0,0.2),0px_8px_10px_1px_rgba(0,0,0,0.14),0px_3px_14px_2px_rgba(0,0,0,0.12)]">
                {["Import Card", "Copy Data", "Export", "Archive File"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="block w-full px-4 py-2 text-left hover:bg-white/5"
                    onClick={() => setOpen(false)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-3 flex items-center">
          <p className="mr-2 text-[34px] font-medium leading-[45.356px]">$500.00</p>
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#651fff] text-[#d1c4e9]">
            <span className="flex origin-center" style={{ transform: "rotate(45deg)" }}>
              <ArrowUpGlyph />
            </span>
          </span>
        </div>
        <p className="text-[16px] font-medium leading-[21.344px] text-berry-secondary-dark">Total Earning</p>
      </div>
    </article>
  );
}
