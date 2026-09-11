"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import {
  AddGlyph,
  SelectCaretGlyph,
  CheckboxCheckedGlyph,
  CheckboxIndeterminateGlyph,
  CheckboxOutlineGlyph,
  DownloadGlyph,
  MoreVertGlyph,
  PageNextGlyph,
  PagePrevGlyph,
  SearchGlyph,
  SortArrowGlyph,
} from "@/components/dashboard/glyphs";
import { orders } from "@/data/mock";

type SortKey = "id" | "customer" | "branch" | "payment" | "qty" | "date" | "status";
type OrderRow = (typeof orders)[number];

const PAGE_SIZES = [10, 25, 50];

function parseOrderDate(value: string) {
  return new Date(value).getTime();
}

function compareRows(a: OrderRow, b: OrderRow, key: SortKey) {
  if (key === "id" || key === "qty") return Number(a[key]) - Number(b[key]);
  if (key === "date") return parseOrderDate(a.date) - parseOrderDate(b.date);
  return String(a[key]).localeCompare(String(b[key]));
}

function Checkbox({
  checked,
  indeterminate = false,
  label,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-checked={indeterminate ? "mixed" : checked}
      role="checkbox"
      onClick={onChange}
      className={`inline-flex h-[42px] w-[42px] items-center justify-center rounded-[8px] p-[9px] ${
        checked || indeterminate ? "text-berry-primary" : "text-berry-muted"
      }`}
    >
      {indeterminate ? <CheckboxIndeterminateGlyph /> : checked ? <CheckboxCheckedGlyph /> : <CheckboxOutlineGlyph />}
    </button>
  );
}

function SortHeader({
  label,
  active,
  direction,
  align = "left",
  onClick,
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  align?: "left" | "right";
  onClick: () => void;
}) {
  return (
    <th
      className={`border-b border-[rgba(189,200,240,0.15)] py-4 text-[14px] font-medium ${
        align === "right" ? "w-[130px] pr-2 pl-4 text-right" : "px-4 text-left"
      } ${active ? "text-berry-text" : "text-berry-th"}`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`group inline-flex items-center ${align === "right" ? "w-full justify-end" : ""}`}
      >
        {label}
        <span
          className={`ml-0.5 inline-flex transition-opacity ${
            active && direction === "asc" ? "rotate-180" : ""
          } ${active ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}
        >
          <SortArrowGlyph />
        </span>
      </button>
    </th>
  );
}

export default function OrdersPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const rows = term
      ? orders.filter((o) =>
          [`#${o.id}`, o.customer, o.branch, o.payment, String(o.qty), o.date, o.status]
            .join(" ")
            .toLowerCase()
            .includes(term),
        )
      : [...orders];
    rows.sort((a, b) => {
      const cmp = compareRows(a, b, sortKey);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [q, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * rowsPerPage;
  const visible = filtered.slice(start, start + rowsPerPage);
  const from = filtered.length === 0 ? 0 : start + 1;
  const to = Math.min(start + rowsPerPage, filtered.length);

  const visibleIds = visible.map((o) => o.id);
  const allVisibleOn = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  const someVisibleOn = visibleIds.some((id) => selected.includes(id));

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleAll = () => {
    if (allVisibleOn) setSelected((prev) => prev.filter((id) => !visibleIds.includes(id)));
    else setSelected((prev) => [...new Set([...prev, ...visibleIds])]);
  };

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <>
      <PageHeader title="List" crumbs={[{ label: "Order" }, { label: "List" }]} />
      <section className="overflow-hidden rounded-[8px] bg-berry-card">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[rgba(132,146,196,0.4)]">
              <SearchGlyph />
            </span>
            <input
              aria-label="Search"
              placeholder="Search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              className="h-11 w-full rounded-[8px] border border-berry-divider bg-berry-canvas pr-3.5 pl-10 text-[14px] font-normal text-berry-text outline-none placeholder:text-[rgba(132,146,196,0.5)] placeholder:font-normal sm:w-[209px]"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[rgba(33,150,243,0.5)] px-4 text-[14px] font-medium text-berry-primary"
            >
              <DownloadGlyph />
              Download
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-berry-primary px-4 text-[14px] font-medium text-white"
            >
              <AddGlyph />
              Add New
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left text-[14px] text-berry-text">
            <thead>
              <tr>
                <th className="w-[87px] border-b border-[rgba(189,200,240,0.15)] px-4 py-[7px]">
                  <Checkbox
                    checked={allVisibleOn}
                    indeterminate={someVisibleOn && !allVisibleOn}
                    label="select all"
                    onChange={toggleAll}
                  />
                </th>
                <SortHeader label="ID" active={sortKey === "id"} direction={sortDir} onClick={() => toggleSort("id")} />
                <SortHeader
                  label="Customer Name"
                  active={sortKey === "customer"}
                  direction={sortDir}
                  onClick={() => toggleSort("customer")}
                />
                <SortHeader
                  label="Branch"
                  active={sortKey === "branch"}
                  direction={sortDir}
                  onClick={() => toggleSort("branch")}
                />
                <SortHeader
                  label="Payment Type"
                  active={sortKey === "payment"}
                  direction={sortDir}
                  onClick={() => toggleSort("payment")}
                />
                <SortHeader
                  label="Quantity"
                  active={sortKey === "qty"}
                  direction={sortDir}
                  align="right"
                  onClick={() => toggleSort("qty")}
                />
                <SortHeader
                  label="Order Date"
                  active={sortKey === "date"}
                  direction={sortDir}
                  onClick={() => toggleSort("date")}
                />
                <SortHeader
                  label="Status"
                  active={sortKey === "status"}
                  direction={sortDir}
                  onClick={() => toggleSort("status")}
                />
                <th className="border-b border-[rgba(189,200,240,0.15)] px-4 py-4 text-center text-[14px] font-medium text-berry-th">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => (
                <tr key={o.id} className="h-[71px] hover:bg-white/[0.02]">
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5">
                    <Checkbox
                      checked={selected.includes(o.id)}
                      label={`select ${o.id}`}
                      onChange={() => toggle(o.id)}
                    />
                  </td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5">#{o.id}</td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5">{o.customer}</td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5">{o.branch}</td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5">{o.payment}</td>
                  <td className="w-[130px] border-b border-[rgba(189,200,240,0.15)] py-3.5 pr-2 pl-4 text-right">{o.qty}</td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5">{o.date}</td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5">
                    <StatusChip label={o.status} />
                  </td>
                  <td className="border-b border-[rgba(189,200,240,0.15)] px-4 py-3.5 text-center">
                    <button
                      type="button"
                      aria-label="row actions"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] p-[5px] text-berry-grey"
                    >
                      <MoreVertGlyph />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex h-11 items-center justify-end pr-0.5 pl-6 text-[14px] text-berry-muted">
          <span>Rows per page:</span>
          <label className="relative mr-5 ml-2 inline-flex h-[38px] w-[50px] items-center">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              aria-label="Rows per page"
              className="h-full w-full appearance-none bg-transparent py-0 pr-6 pl-2 text-[14px] text-berry-muted outline-none"
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n} className="bg-berry-card text-berry-text">
                  {n}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-white">
              <SelectCaretGlyph />
            </span>
          </label>
          <span className="mr-6">
            {from}–{to} of {filtered.length}
          </span>
          <button
            type="button"
            aria-label="Go to previous page"
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
            className="inline-flex h-5 w-5 items-center justify-center text-berry-text disabled:text-white/30"
          >
            <PagePrevGlyph />
          </button>
          <button
            type="button"
            aria-label="Go to next page"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage(safePage + 1)}
            className="ml-2 inline-flex h-5 w-5 items-center justify-center text-berry-text disabled:text-white/30"
          >
            <PageNextGlyph />
          </button>
        </div>
      </section>
    </>
  );
}
