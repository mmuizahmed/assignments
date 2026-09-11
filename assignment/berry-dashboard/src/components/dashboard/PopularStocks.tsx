"use client";

import { IconDots } from "@tabler/icons-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { bajajArea, stocks } from "@/data/mock";
import { CaretDownGlyph, CaretUpGlyph, ChevronRightGlyph } from "./glyphs";

const areaData = bajajArea.map((v, i) => ({ i, v }));

export default function PopularStocks() {
  return (
    <article className="rounded-[8px] bg-berry-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-[16px] font-semibold leading-[19.76px] text-berry-heading">Popular Stocks</h4>
        <button type="button" className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] text-berry-muted">
          <IconDots size={20} />
        </button>
      </div>

      <div className="overflow-hidden rounded-[8px] bg-[#d1c4e9] p-4">
        <div className="flex items-start justify-between">
          <div>
            <h6 className="text-[14px] font-medium leading-[24.5px] text-[#7c4dff]">Bajaj Finery</h6>
            <p className="text-[12px] leading-[18.84px] text-[#364152]">10% Profit</p>
          </div>
          <h4 className="text-[16px] font-semibold leading-[19.76px] text-[#364152]">$1839.00</h4>
        </div>
        <div className="mt-1 h-[95px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="bajaj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c4dff" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#7c4dff" stopOpacity={0.18} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#7c4dff" strokeWidth={2} fill="url(#bajaj)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ul className="mt-1">
        {stocks.map((row, i) => (
          <li key={`${row.name}-${i}`} className="flex items-center justify-between border-b border-berry-level py-2.5 last:border-b-0">
            <div>
              <p className="text-[14px] font-medium leading-[24.5px] text-berry-text">{row.name}</p>
              <p className={`text-[12px] leading-[18.84px] ${row.up ? "text-berry-success" : "text-berry-error"}`}>
                {row.change}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-[14px] font-medium text-berry-text">{row.value}</p>
              {row.up ? (
                <span className="text-berry-success">
                  <CaretUpGlyph />
                </span>
              ) : (
                <span className="text-berry-error">
                  <CaretDownGlyph />
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-1 flex h-11 w-full items-center justify-center gap-0.5 rounded-[8px] px-4 text-[14px] font-medium leading-5 text-berry-primary"
      >
        View All
        <ChevronRightGlyph />
      </button>
    </article>
  );
}
