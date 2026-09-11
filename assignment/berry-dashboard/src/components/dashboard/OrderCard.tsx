"use client";

import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { orderSparkline } from "@/data/mock";
import { ArrowDownGlyph, ShoppingBagGlyph } from "./glyphs";

export default function OrderCard() {
  const [range, setRange] = useState<"month" | "year">("year");
  const data = useMemo(
    () => (range === "year" ? orderSparkline.year : orderSparkline.month).map((v, i) => ({ i, v })),
    [range],
  );

  return (
    <article className="relative h-[180px] overflow-hidden rounded-[8px] text-white" style={{ background: "rgba(21, 101, 192, 0.2)" }}>
      <span className="pointer-events-none absolute -top-[85px] -right-[95px] h-[210px] w-[210px] rounded-full bg-[#1565c0] opacity-40" />
      <span className="pointer-events-none absolute -top-[125px] -right-[15px] h-[210px] w-[210px] rounded-full bg-[#1565c0] opacity-25" />
      <div className="relative flex h-full p-[18px]">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#1565c0] text-white">
              <ShoppingBagGlyph />
            </div>
            <div className="flex">
              <button
                type="button"
                onClick={() => setRange("month")}
                className={`h-9 rounded-[8px] px-4 text-[12px] font-medium leading-5 ${
                  range === "month" ? "bg-berry-primary text-white" : "bg-transparent text-white"
                }`}
              >
                Month
              </button>
              <button
                type="button"
                onClick={() => setRange("year")}
                className={`h-9 rounded-[8px] px-4 text-[12px] font-medium leading-5 ${
                  range === "year" ? "bg-berry-primary text-white" : "bg-transparent text-white"
                }`}
              >
                Year
              </button>
            </div>
          </div>
          <div className="mt-auto flex items-end justify-between gap-2">
            <div>
              <div className="flex items-center">
                <p className="mr-2 text-[34px] font-medium leading-[45.356px]">
                  {range === "year" ? "$961" : "$108"}
                </p>
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#1e88e5] text-[#e3f2fd]">
                  <span className="flex origin-center" style={{ transform: "rotate(-45deg)" }}>
                    <ArrowDownGlyph />
                  </span>
                </span>
              </div>
              <p className="text-[16px] font-medium leading-[21.344px] text-berry-primary-dark">Total Order</p>
            </div>
            <div className="h-[90px] w-[166px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 4 }}>
                  <Line type="monotone" dataKey="v" stroke="#ffffff" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
