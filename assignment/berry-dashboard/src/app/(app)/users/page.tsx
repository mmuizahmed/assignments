"use client";

import { useMemo, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import { BlockGlyph, CheckCircleGlyph, CommentGlyph } from "@/components/dashboard/glyphs";
import { users } from "@/data/mock";

export default function UsersPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(q.toLowerCase()) ||
          u.email.toLowerCase().includes(q.toLowerCase()) ||
          u.country.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <>
      <PageHeader title="Style 01" crumbs={[{ label: "List" }, { label: "Style 01" }]} />
      <section className="overflow-hidden rounded-[8px] bg-berry-card">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[20px] font-semibold leading-[23.34px] text-berry-heading">List</h3>
          <label className="relative">
            <IconSearch size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-berry-muted" />
            <input
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-[44px] w-full rounded-[8px] border border-berry-divider bg-berry-canvas pr-3 pl-10 text-[14px] text-berry-text outline-none sm:w-[209px]"
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[14px]">
            <thead>
              <tr className="text-[14px] font-medium text-berry-th">
                <th className="border-b border-[rgba(189,200,240,0.15)] px-4 py-4 pl-6">#</th>
                <th className="border-b border-[rgba(189,200,240,0.15)] px-4 py-4">User Profile</th>
                <th className="border-b border-[rgba(189,200,240,0.15)] px-4 py-4">Country</th>
                <th className="border-b border-[rgba(189,200,240,0.15)] px-4 py-4">Friends</th>
                <th className="border-b border-[rgba(189,200,240,0.15)] px-4 py-4">Followers</th>
                <th className="border-b border-[rgba(189,200,240,0.15)] px-4 py-4">Status</th>
                <th className="border-b border-[rgba(189,200,240,0.15)] px-4 py-4 pr-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="h-[73px]">
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5 pl-6 text-berry-text">{u.id}</td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <img src={u.avatar} alt="" className="h-10 w-10 object-cover" />
                      </span>
                      <div>
                        <p className="flex items-center gap-1 text-[14px] font-medium leading-[24.5px] text-berry-text">
                          {u.name}
                          {u.verified ? (
                            <span className="text-berry-success">
                              <CheckCircleGlyph />
                            </span>
                          ) : null}
                        </p>
                        <p className="text-[12px] leading-[18.84px] text-berry-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5 text-berry-text">{u.country}</td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5 text-berry-text">{u.friends}</td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5 text-berry-text">{u.followers}</td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5">
                    <StatusChip label={u.status} />
                  </td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5 pr-6 text-center">
                    <button
                      type="button"
                      aria-label="delete"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] p-2 text-berry-primary hover:bg-[rgba(33,150,243,0.08)]"
                    >
                      <CommentGlyph />
                    </button>
                    <button
                      type="button"
                      aria-label="block"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] p-2 text-berry-error hover:bg-[rgba(244,67,54,0.08)]"
                    >
                      <BlockGlyph />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[rgba(189,200,240,0.15)] px-6 py-4 sm:flex-row">
          <nav aria-label="pagination navigation" className="flex items-center gap-1 text-[14px]">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`h-8 min-w-8 rounded-full px-2 ${
                  page === n ? "bg-berry-secondary text-white" : "text-berry-text hover:bg-white/5"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="px-1">…</span>
            <button type="button" className="h-8 min-w-8 rounded-full px-2 text-berry-text">
              10
            </button>
          </nav>
          <button type="button" className="h-11 rounded-[8px] px-4 text-[14px] font-medium text-[#f8fafc]">
            10 Rows
          </button>
        </div>
      </section>
    </>
  );
}
