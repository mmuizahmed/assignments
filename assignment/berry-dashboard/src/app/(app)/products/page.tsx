"use client";

import { useMemo, useState, type ReactNode } from "react";
import PageHeader from "@/components/layout/PageHeader";
import {
  AddCartGlyph,
  CheckboxCheckedGlyph,
  CheckboxOutlineGlyph,
  ExpandMoreGlyph,
  FilterListGlyph,
  KeyboardArrowRightGlyph,
  RadioCheckedGlyph,
  RadioOutlineGlyph,
  SearchGlyph,
  SelectCaretGlyph,
  StarGlyph,
} from "@/components/dashboard/glyphs";
import { productColors, products } from "@/data/mock";

const GENDERS = ["Male", "Female", "Kids"] as const;
const CATEGORIES = ["All", "Kitchen", "Electronics", "Books", "Fashion", "Toys"] as const;
const PRICE_OPTIONS = [
  { id: "lt10", label: "Below $10", test: (n: number) => n < 10 },
  { id: "10-50", label: "$10 - $50", test: (n: number) => n >= 10 && n <= 50 },
  { id: "50-100", label: "$50 - $100", test: (n: number) => n >= 50 && n <= 100 },
  { id: "100-150", label: "$100 - $150", test: (n: number) => n >= 100 && n <= 150 },
  { id: "150-200", label: "$150 - $200", test: (n: number) => n >= 150 && n <= 200 },
  { id: "gt200", label: "Over $200", test: (n: number) => n > 200 },
] as const;
const RATING_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;
const SORTS = ["Price: High To Low", "Price: Low To High", "Popularity", "Discount", "Fresh Arrivals"] as const;

type Product = (typeof products)[number];
type SortKey = (typeof SORTS)[number];

function formatPrice(n: number) {
  if (Number.isInteger(n)) return `$${n}`;
  return `$${n.toFixed(2).replace(/(\.\d)0$/, "$1")}`;
}

function discountOf(p: Product) {
  if (!p.original) return 0;
  return (p.original - p.price) / p.original;
}

function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center" aria-label={`${value} Stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, value - i));
        return (
          <span key={i} className="relative inline-block text-[rgba(255,255,255,0.26)]" style={{ width: size, height: size }}>
            <span className="absolute inset-0">
              <StarGlyph />
            </span>
            {fill > 0 ? (
              <span className="absolute inset-0 overflow-hidden text-berry-warning" style={{ width: `${fill * 100}%` }}>
                <StarGlyph />
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

function CheckRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center text-[14px] text-berry-text">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`inline-flex h-[42px] w-[42px] items-center justify-center ${checked ? "text-berry-secondary" : "text-berry-muted"}`}
      >
        {checked ? <CheckboxCheckedGlyph /> : <CheckboxOutlineGlyph />}
      </button>
      {label}
    </label>
  );
}

function RadioRow({
  checked,
  label,
  onChange,
  extra,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
  extra?: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center text-[14px] text-berry-text">
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`inline-flex h-[42px] w-[42px] items-center justify-center ${checked ? "text-berry-secondary" : "text-berry-muted"}`}
      >
        {checked ? <RadioCheckedGlyph /> : <RadioOutlineGlyph />}
      </button>
      {extra}
      <span>{label}</span>
    </label>
  );
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-[rgba(189,200,240,0.12)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-16 w-full items-center justify-between px-4 text-[14px] font-medium text-berry-th"
      >
        {title}
        <span className={open ? "rotate-180" : ""}>
          <ExpandMoreGlyph />
        </span>
      </button>
      {open ? <div className="px-4 pb-4">{children}</div> : null}
    </div>
  );
}

export default function ProductsPage() {
  const [q, setQ] = useState("");
  const [filterOpen, setFilterOpen] = useState(true);
  const [sort, setSort] = useState<SortKey>("Price: Low To High");
  const [sortMenu, setSortMenu] = useState(false);
  const [genders, setGenders] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>(["All"]);
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState<number | "empty" | "">("");
  const [openAcc, setOpenAcc] = useState({
    Gender: true,
    Categories: true,
    Colors: true,
    Price: true,
    Rating: true,
  });
  const [cart, setCart] = useState<number[]>([]);

  const toggleAcc = (key: keyof typeof openAcc) => setOpenAcc((s) => ({ ...s, [key]: !s[key] }));

  const toggleGender = (g: string) =>
    setGenders((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const toggleCat = (c: string) => {
    if (c === "All") setCats(["All"]);
    else
      setCats((prev) => {
        const next = prev.includes(c) ? prev.filter((x) => x !== c && x !== "All") : [...prev.filter((x) => x !== "All"), c];
        return next.length ? next : ["All"];
      });
  };

  const clear = () => {
    setGenders([]);
    setCats(["All"]);
    setColor("");
    setPrice("");
    setRating("");
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const priceTest = PRICE_OPTIONS.find((p) => p.id === price)?.test;
    const rows = products.filter((p) => {
      if (term && !`${p.name} ${p.description}`.toLowerCase().includes(term)) return false;
      if (genders.length && !genders.includes(p.gender)) return false;
      if (cats.length && !cats.includes("All") && !cats.includes(p.category)) return false;
      if (color && !p.colors.includes(color)) return false;
      if (priceTest && !priceTest(p.price)) return false;
      if (rating === "empty") return false;
      if (typeof rating === "number" && p.rating < rating) return false;
      return true;
    });
    rows.sort((a, b) => {
      if (sort === "Price: Low To High") return a.price - b.price;
      if (sort === "Price: High To Low") return b.price - a.price;
      if (sort === "Popularity") return b.reviews - a.reviews;
      if (sort === "Discount") return discountOf(b) - discountOf(a);
      return b.id - a.id;
    });
    return rows;
  }, [q, genders, cats, color, price, rating, sort]);

  return (
    <>
      <PageHeader title="Products" crumbs={[{ label: "E-commerce" }, { label: "Products" }]} />

      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center">
          <h4 className="text-[16px] font-semibold text-berry-heading">Shop</h4>
          <button type="button" aria-label="go to shopping" className="flex h-[52px] w-[52px] items-center justify-center text-berry-muted">
            <KeyboardArrowRightGlyph />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative block">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[rgba(132,146,196,0.4)]">
              <SearchGlyph />
            </span>
            <input
              aria-label="Search Product"
              placeholder="Search Product"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-11 w-full rounded-[8px] border border-berry-divider bg-berry-canvas pr-3.5 pl-10 text-[14px] font-normal text-berry-text outline-none placeholder:font-normal placeholder:text-[rgba(132,146,196,0.5)] sm:w-[209px]"
            />
          </label>
          <span className="hidden h-6 w-px bg-[rgba(189,200,240,0.2)] sm:block" />
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className="inline-flex h-11 items-center gap-2 px-4 text-[14px] font-medium text-berry-secondary"
          >
            <FilterListGlyph />
            Filter
          </button>
          <span className="hidden h-6 w-px bg-[rgba(189,200,240,0.2)] sm:block" />
          <h5 className="text-[14px] font-medium text-berry-heading">Sort by:</h5>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortMenu((v) => !v)}
              className="inline-flex h-11 items-center gap-1 text-[14px] text-berry-grey"
            >
              {sort}
              <SelectCaretGlyph />
            </button>
            {sortMenu ? (
              <ul className="absolute right-0 z-20 mt-1 min-w-[200px] rounded-[8px] bg-berry-card py-2 shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
                {SORTS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => {
                        setSort(s);
                        setSortMenu(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-[14px] ${
                        sort === s ? "bg-white/5 text-berry-secondary" : "text-berry-text hover:bg-white/5"
                      }`}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse items-stretch gap-6 xl:flex-row xl:items-start">
        <div className={`grid min-w-0 flex-1 grid-cols-1 gap-6 sm:grid-cols-2 ${filterOpen ? "xl:grid-cols-3" : "lg:grid-cols-3"}`}>
          {filtered.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-[8px] bg-berry-card">
              <a
                href="#shop"
                className="block h-[220px] bg-cover bg-center"
                style={{ backgroundImage: `url("${p.image}")` }}
                aria-label={p.name}
              />
              <div className="p-4 pb-6">
                <a href="#shop" className="block text-[14px] leading-[18.676px] text-[#9e9eff]">
                  {p.name}
                </a>
                <p className="mt-1 truncate text-[14px] leading-[21px] text-berry-text">{p.description}</p>
                <div className="mt-2 flex items-center gap-1">
                  <Stars value={p.rating} />
                  <span className="text-[12px] text-berry-muted">
                    ({p.reviews}+)
                  </span>
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-[16px] font-semibold text-berry-heading">{formatPrice(p.price)}</h4>
                    {p.original ? (
                      <h6 className="text-[12px] font-medium text-berry-grey line-through">{formatPrice(p.original)}</h6>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label="product add to cart"
                    onClick={() => setCart((prev) => [...prev, p.id])}
                    className="inline-flex h-11 w-[52px] items-center justify-center rounded-[8px] bg-berry-primary text-white"
                  >
                    <AddCartGlyph />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filterOpen ? (
          <aside className="w-full shrink-0 overflow-hidden rounded-[8px] bg-berry-card xl:w-[320px]">
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto berry-scroll">
              <Accordion title="Gender" open={openAcc.Gender} onToggle={() => toggleAcc("Gender")}>
                <div className="flex flex-wrap">
                  {GENDERS.map((g) => (
                    <CheckRow key={g} label={g} checked={genders.includes(g)} onChange={() => toggleGender(g)} />
                  ))}
                </div>
              </Accordion>
              <Accordion title="Categories" open={openAcc.Categories} onToggle={() => toggleAcc("Categories")}>
                <div className="grid grid-cols-2">
                  {CATEGORIES.map((c) => (
                    <CheckRow key={c} label={c} checked={cats.includes(c)} onChange={() => toggleCat(c)} />
                  ))}
                </div>
              </Accordion>
              <Accordion title="Colors" open={openAcc.Colors} onToggle={() => toggleAcc("Colors")}>
                <div className="flex flex-wrap gap-2">
                  {productColors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      aria-label={c.label}
                      onClick={() => setColor((prev) => (prev === c.id ? "" : c.id))}
                      className={`h-7 w-7 rounded-full ${color === c.id ? "ring-2 ring-berry-primary ring-offset-2 ring-offset-berry-card" : ""}`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </Accordion>
              <Accordion title="Price" open={openAcc.Price} onToggle={() => toggleAcc("Price")}>
                <div className="flex flex-col">
                  {PRICE_OPTIONS.map((opt) => (
                    <RadioRow
                      key={opt.id}
                      label={opt.label}
                      checked={price === opt.id}
                      onChange={() => setPrice((prev) => (prev === opt.id ? "" : opt.id))}
                    />
                  ))}
                </div>
              </Accordion>
              <Accordion title="Rating" open={openAcc.Rating} onToggle={() => toggleAcc("Rating")}>
                <div className="flex flex-col">
                  {RATING_OPTIONS.map((n) => (
                    <RadioRow
                      key={n}
                      label={n === 1 ? "1 Star" : `${n} Stars`}
                      checked={rating === n}
                      onChange={() => setRating((prev) => (prev === n ? "" : n))}
                      extra={
                        <span className="mr-2">
                          <Stars value={n} />
                        </span>
                      }
                    />
                  ))}
                  <RadioRow
                    label="Empty"
                    checked={rating === "empty"}
                    onChange={() => setRating((prev) => (prev === "empty" ? "" : "empty"))}
                    extra={
                      <span className="mr-2 text-[12px] text-berry-muted">(0)</span>
                    }
                  />
                </div>
              </Accordion>
              <div className="p-4">
                <button type="button" onClick={clear} className="text-[14px] font-medium text-berry-primary">
                  Clear All
                </button>
              </div>
            </div>
          </aside>
        ) : null}
      </div>

      <a
        href="#shop"
        aria-label="cart"
        className="fixed top-1/2 right-2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-l-[8px] bg-berry-warning text-berry"
      >
        <span className="relative inline-flex">
          <AddCartGlyph />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-berry-error px-1 text-[10px] font-medium text-white">
            {cart.length}
          </span>
        </span>
      </a>
    </>
  );
}
