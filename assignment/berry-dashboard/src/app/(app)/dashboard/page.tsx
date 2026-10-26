"use client";

import { useEffect, useState } from "react";
import EarningCard from "@/components/dashboard/EarningCard";
import OrderCard from "@/components/dashboard/OrderCard";
import { IncomeDarkCard, IncomeLightCard } from "@/components/dashboard/IncomeCards";
import GrowthChart from "@/components/dashboard/GrowthChart";
import PopularStocks from "@/components/dashboard/PopularStocks";
import { api } from "@/lib/api";

type Stats = {
  earning: number;
  income: number;
  orderCount: number;
  monthCount: number;
  months: number[];
};

const emptyStats: Stats = {
  earning: 0,
  income: 0,
  orderCount: 0,
  monthCount: 0,
  months: [],
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>(emptyStats);

  useEffect(() => {
    api<Stats>("/api/dashboard")
      .then(setStats)
      .catch(() => setStats(emptyStats));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 min-[1200px]:grid-cols-3">
        <EarningCard amount={stats.earning} />
        <OrderCard yearCount={stats.orderCount} monthCount={stats.monthCount} />
        <div className="flex flex-col gap-6 min-[1200px]:col-span-1">
          <IncomeDarkCard amount={stats.income} />
          <IncomeLightCard amount={stats.income} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-12">
        <div className="min-[900px]:col-span-8">
          <GrowthChart total={stats.earning} months={stats.months} />
        </div>
        <div className="min-[900px]:col-span-4">
          <PopularStocks />
        </div>
      </div>
    </div>
  );
}
