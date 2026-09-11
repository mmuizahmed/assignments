"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconDashboard,
  IconUsers,
  IconShoppingCart,
  IconClipboardList,
  IconTable,
} from "@tabler/icons-react";
import BerryLogo from "./BerryLogo";
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from "@/lib/tokens";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: IconDashboard, group: "Dashboard" },
  { href: "/users", label: "Users", icon: IconUsers, group: "Application" },
  { href: "/products", label: "Products", icon: IconShoppingCart, group: "Application" },
  { href: "/orders", label: "Orders", icon: IconClipboardList, group: "Application" },
];

export default function Sidebar({
  open,
  desktop,
  onClose,
}: {
  open: boolean;
  desktop: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const mini = desktop && !open;
  const width = mini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;
  const overlay = open && !desktop;

  return (
    <>
      {overlay ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-[55] bg-black/50"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={`fixed top-0 left-0 flex h-full flex-col overflow-x-hidden bg-berry text-berry-text shadow-[0_1px_2px_0_rgba(41,49,79,0.24)] transition-[width,transform] duration-[400ms] ease-out ${
          open || desktop ? "translate-x-0" : "-translate-x-full"
        } ${overlay ? "z-[60]" : "z-40"}`}
        style={{ width }}
      >
        <div className="flex h-[70px] shrink-0 items-center overflow-hidden px-4">
          <Link href="/dashboard" aria-label="theme-logo" onClick={onClose} className="block shrink-0">
            <BerryLogo />
          </Link>
        </div>

        <nav
          className={`berry-scroll mt-5 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden pb-4 ${
            mini ? "px-0" : "px-4"
          }`}
          aria-label="mailbox folders"
        >
          <div>
            {["Dashboard", "Application"].map((group) => (
              <div key={group} className={mini ? undefined : "mb-1"}>
                {mini ? null : (
                  <span
                    className="mb-0 block text-[14px] font-medium leading-[23.24px] text-berry-heading"
                    style={{ padding: 6 }}
                  >
                    {group}
                  </span>
                )}
                {items
                  .filter((item) => item.group === group)
                  .map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={item.label}
                        onClick={() => {
                          if (!desktop) onClose();
                        }}
                        className={`mb-1 flex items-center text-[14px] leading-[18.676px] ${
                          mini
                            ? "h-[46px] justify-start rounded-[8px] pr-4 pl-[10px]"
                            : `h-[46px] gap-3 rounded-[8px] px-4 ${
                                active
                                  ? "bg-[rgba(124,77,255,0.15)] font-medium text-berry-secondary"
                                  : "text-berry-text hover:bg-white/5"
                              }`
                        }`}
                      >
                        <span
                          className={`flex shrink-0 items-center justify-center rounded-[8px] ${
                            mini
                              ? `h-[46px] w-[46px] ${
                                  active
                                    ? "bg-[rgba(124,77,255,0.25)] text-berry-secondary"
                                    : "text-berry-text"
                                }`
                              : `h-6 w-9 ${active ? "text-berry-secondary" : "text-berry-text"}`
                          }`}
                        >
                          <Icon size={24} stroke={1.5} />
                        </span>
                        {mini ? <span className="sr-only">{item.label}</span> : item.label}
                      </Link>
                    );
                  })}
              </div>
            ))}
          </div>

          {mini ? null : (
            <>
              <div className="mt-auto rounded-[8px] bg-berry-level p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-berry-card text-berry-primary">
                    <IconTable size={24} stroke={1.5} />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium leading-[24.5px] text-berry-text">
                      Get Extra Space
                    </p>
                    <p className="text-[12px] leading-[14px] text-berry-muted">28/23 GB</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[12px] font-medium leading-[19.2px]">
                  <span className="text-berry-primary">Progress</span>
                  <span className="text-berry-text">80%</span>
                </div>
                <div
                  className="mt-1 h-[10px] overflow-hidden rounded-[120px]"
                  style={{ background: "#104b79" }}
                  role="progressbar"
                  aria-valuenow={80}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="h-full w-4/5 rounded-[20px] bg-berry-primary" />
                </div>
              </div>
              <p className="mt-3 px-1 text-[12px] text-berry-muted">v5.2.0</p>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
