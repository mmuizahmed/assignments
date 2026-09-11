import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { HomeGlyph } from "@/components/dashboard/glyphs";

export default function PageHeader({
  title,
  crumbs,
}: {
  title: string;
  crumbs: { label: string; href?: string }[];
}) {
  return (
    <div className="mb-6 flex h-10 items-center justify-between rounded-[8px] border-0 bg-berry-level px-4 py-2.5 shadow-none">
      <h4 className="text-[16px] font-medium leading-[19.76px] text-berry-heading">{title}</h4>
      <nav aria-label="breadcrumb" className="flex items-center text-[14px] text-berry-muted">
        <Link href="/dashboard" className="text-berry-secondary" aria-label="Home">
          <HomeGlyph />
        </Link>
        {crumbs.map((c) => (
          <span key={c.label} className="flex items-center">
            <IconChevronRight size={16} stroke={1.5} className="mx-0.5 text-berry-muted" />
            {c.href ? (
              <Link href={c.href} className="text-berry-muted hover:text-berry-primary">
                {c.label}
              </Link>
            ) : (
              <span className="text-berry-muted">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
