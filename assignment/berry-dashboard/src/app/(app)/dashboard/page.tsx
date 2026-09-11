import EarningCard from "@/components/dashboard/EarningCard";
import OrderCard from "@/components/dashboard/OrderCard";
import { IncomeDarkCard, IncomeLightCard } from "@/components/dashboard/IncomeCards";
import GrowthChart from "@/components/dashboard/GrowthChart";
import PopularStocks from "@/components/dashboard/PopularStocks";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 min-[1200px]:grid-cols-3">
        <EarningCard />
        <OrderCard />
        <div className="flex flex-col gap-6 min-[1200px]:col-span-1">
          <IncomeDarkCard />
          <IncomeLightCard />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-12">
        <div className="min-[900px]:col-span-8">
          <GrowthChart />
        </div>
        <div className="min-[900px]:col-span-4">
          <PopularStocks />
        </div>
      </div>
    </div>
  );
}
