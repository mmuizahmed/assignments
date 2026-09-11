"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { growthSeries } from "@/data/mock";
import { ChartMenuGlyph } from "./glyphs";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const series = [
  { key: "Investment", color: "#1e88e5" },
  { key: "Loss", color: "#90caf9" },
  { key: "Profit", color: "#7c4dff" },
  { key: "Maintenance", color: "#6200ea" },
] as const;

export default function GrowthChart() {
  const [period, setPeriod] = useState("Today");
  const data = useMemo(
    () =>
      months.map((name, i) => ({
        name,
        Investment: growthSeries.investment[i],
        Loss: growthSeries.loss[i],
        Profit: growthSeries.profit[i],
        Maintenance: growthSeries.maintenance[i],
      })),
    [],
  );

  return (
    <article className="rounded-[8px] bg-berry-card p-6">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h6 className="text-[12px] font-normal leading-[18.84px] text-berry-muted">Total Growth</h6>
          <h3 className="mt-2 text-[20px] font-semibold leading-[23.34px] text-berry-heading">$2,324.00</h3>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="h-10 rounded-[8px] border border-berry-divider bg-transparent px-3 text-[14px] text-berry-text outline-none"
        >
          {["Today", "This Month", "This Year"].map((opt) => (
            <option key={opt} value={opt} className="bg-berry-card">
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="relative h-[480px] w-full">
        <button
          type="button"
          aria-label="Menu"
          className="absolute top-0 right-1 z-10 flex h-[30px] w-8 items-center justify-center text-berry-muted"
        >
          <ChartMenuGlyph />
        </button>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="28%" margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid vertical={false} stroke="#29314f" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#8492c4", fontSize: 12 }} />
            <YAxis
              domain={[0, 400]}
              ticks={[0, 100, 200, 300, 400]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8492c4", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{ background: "#212946", border: "1px solid #364152", borderRadius: 8, color: "#bdc8f0" }}
            />
            {series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                stackId="a"
                fill={s.color}
                fillOpacity={0.85}
                stroke={s.color}
                strokeWidth={1}
                maxBarSize={27}
                radius={i === series.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-1 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] text-berry-text">
        {series.map((s) => (
          <li key={s.key} className="flex items-center gap-2">
            <span className="inline-block h-[14px] w-[14px] rounded-[2px]" style={{ background: s.color }} />
            {s.key}
          </li>
        ))}
      </ul>
    </article>
  );
}
