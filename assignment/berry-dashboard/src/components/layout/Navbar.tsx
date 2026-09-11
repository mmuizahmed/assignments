"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  IconMenu2,
  IconSearch,
  IconAdjustmentsHorizontal,
  IconAccessPoint,
  IconBell,
  IconSettings,
  IconArrowsMaximize,
  IconArrowsMinimize,
} from "@tabler/icons-react";
import BerryLogo from "./BerryLogo";
import { HEADER_HEIGHT } from "@/lib/tokens";

export default function Navbar({
  onMenu,
  menuOpen,
}: {
  onMenu: () => void;
  menuOpen: boolean;
}) {
  const [query, setQuery] = useState("");
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 bg-berry text-berry-text shadow-none"
      style={{ height: HEADER_HEIGHT }}
    >
      <div
        className="flex w-full min-w-0 items-center"
        style={{ height: HEADER_HEIGHT, padding: "16px 24px" }}
      >
        <div className="flex w-auto min-[900px]:w-[228px]">
          <Link
            href="/dashboard"
            className="hidden min-w-0 flex-1 min-[900px]:block"
            aria-label="theme-logo"
          >
            <BerryLogo />
          </Link>
          <HeaderAvatar
            tone="secondary"
            label="Open menu"
            expanded={menuOpen}
            onClick={onMenu}
          >
            <IconMenu2 size={20} stroke={1.5} />
          </HeaderAvatar>
        </div>

        <div className="relative ml-4 hidden h-[44px] w-[250px] items-center rounded-[8px] border border-[#364152] bg-[#1a223f] px-4 min-[900px]:flex min-[1200px]:w-[434px]">
          <span className="mr-2 flex h-5 w-5 items-center justify-center text-[rgba(132,146,196,0.4)]">
            <IconSearch size={20} stroke={1.5} />
          </span>
          <input
            aria-label="Search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-[44px] min-w-0 flex-1 bg-transparent py-3 pr-0 text-[16px] leading-[23px] font-normal text-berry-text outline-none placeholder:text-[rgba(132,146,196,0.5)] placeholder:font-normal"
          />
          <span className="ml-2">
            <HeaderAvatar tone="secondary" label="Filters">
              <IconAdjustmentsHorizontal size={20} stroke={1.5} />
            </HeaderAvatar>
          </span>
        </div>

        <div className="ml-4 min-[900px]:hidden">
          <HeaderAvatar tone="secondary" label="Search">
            <IconSearch size={19.2} stroke={1.5} />
          </HeaderAvatar>
        </div>

        <div className="flex-1" />
        <div className="hidden flex-1 min-[900px]:block" />

        <div className="hidden min-[600px]:block">
          <HeaderAvatar tone="secondary" label="Broadcast">
            <IconAccessPoint size={20} stroke={1.5} />
          </HeaderAvatar>
        </div>

        <div className="hidden h-[34px] w-[50px] items-center justify-end min-[600px]:flex">
          <HeaderAvatar tone="primary" label="Language">
            <TranslateIcon />
          </HeaderAvatar>
        </div>

        <div className="ml-4">
          <HeaderAvatar tone="warning" label="Notifications">
            <IconBell size={20} stroke={1.5} />
          </HeaderAvatar>
        </div>

        <div className="hidden h-[34px] w-[50px] items-center justify-end min-[600px]:flex">
          <HeaderAvatar tone="primary" label="Fullscreen" onClick={toggleFullscreen}>
            {fullscreen ? (
              <IconArrowsMinimize size={24} stroke={2} />
            ) : (
              <IconArrowsMaximize size={24} stroke={2} />
            )}
          </HeaderAvatar>
        </div>

        <button
          type="button"
          aria-label="user-account"
          className="ml-4 flex h-12 w-[90px] cursor-pointer items-center rounded-[27px] border-0 bg-[rgba(33,150,243,0.15)] p-0 text-[#2196f3] transition-all duration-200 hover:bg-[#2196f3] hover:text-[#e3f2fd]"
        >
          <img
            src="/user-round.svg"
            alt="user-images"
            width={34}
            height={34}
            className="my-2 ml-2 h-[34px] w-[34px] rounded-full object-cover"
          />
          <span className="px-3 leading-[0]">
            <IconSettings size={24} stroke={1.5} />
          </span>
        </button>
      </div>
    </header>
  );
}

function HeaderAvatar({
  children,
  tone,
  label,
  onClick,
  expanded,
}: {
  children: ReactNode;
  tone: "secondary" | "primary" | "warning";
  label: string;
  onClick?: () => void;
  expanded?: boolean;
}) {
  const toneClass =
    tone === "secondary"
      ? "text-[#7c4dff] hover:bg-[#7c4dff] hover:text-[#d1c4e9]"
      : tone === "primary"
        ? "text-[#2196f3] hover:bg-[#2196f3] hover:text-[#e3f2fd]"
        : "text-[#f8bb05] hover:bg-[#f8bb05] hover:text-[#fff8e1]";

  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      onClick={onClick}
      className={`flex h-[34px] w-[34px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[8px] border-0 bg-[#29314f] p-0 transition-all duration-200 ${toneClass}`}
    >
      {children}
    </button>
  );
}

function TranslateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="m12.87 15.07-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2zm-2.62 7 1.62-4.33L19.12 17z" />
    </svg>
  );
}
