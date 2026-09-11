import { StorefrontGlyph, TableChartGlyph } from "./glyphs";

export function IncomeDarkCard() {
  return (
    <article className="relative h-[80px] overflow-hidden rounded-[8px] bg-[#1e88e5] text-[#e3f2fd]">
      <span
        className="pointer-events-none absolute -top-[30px] -right-[180px] h-[210px] w-[210px] rounded-full"
        style={{ background: "linear-gradient(210.04deg, #90caf9 -50.94%, rgba(144, 202, 249, 0) 83.49%)" }}
      />
      <span
        className="pointer-events-none absolute -top-[160px] -right-[130px] h-[210px] w-[210px] rounded-full"
        style={{ background: "linear-gradient(140.9deg, #90caf9 -14.02%, rgba(144, 202, 249, 0) 77.58%)" }}
      />
      <div className="relative flex h-full items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#1565c0] text-white">
          <TableChartGlyph />
        </div>
        <div>
          <h4 className="text-[16px] font-semibold leading-[19.76px] text-white">$203k</h4>
          <p className="mt-0.5 text-[12px] leading-[18.84px] text-[#e3f2fd]">Total Income</p>
        </div>
      </div>
    </article>
  );
}

export function IncomeLightCard() {
  return (
    <article className="relative h-[82px] overflow-hidden rounded-[8px] bg-berry-card text-berry-text">
      <span
        className="pointer-events-none absolute -top-[30px] -right-[180px] h-[210px] w-[210px] rounded-full"
        style={{ background: "linear-gradient(210.04deg, #ffe479 -50.94%, rgba(144, 202, 249, 0) 83.49%)" }}
      />
      <span
        className="pointer-events-none absolute -top-[160px] -right-[130px] h-[210px] w-[210px] rounded-full"
        style={{ background: "linear-gradient(140.9deg, #ffe479 -14.02%, rgba(144, 202, 249, 0) 70.50%)" }}
      />
      <div className="relative flex h-full items-center gap-4 p-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[8px]"
          style={{ background: "rgba(255, 228, 121, 0.15)", color: "#f8bb05" }}
        >
          <StorefrontGlyph />
        </div>
        <div>
          <h4 className="text-[16px] font-semibold leading-[19.76px] text-berry-heading">$203k</h4>
          <p className="mt-1 text-[12px] leading-[18.84px] text-berry-grey">Total Income</p>
        </div>
      </div>
    </article>
  );
}
