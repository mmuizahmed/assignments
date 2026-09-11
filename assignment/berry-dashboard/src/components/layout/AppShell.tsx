"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CustomizeFab from "./CustomizeFab";
import { CONTAINER_MAX, DRAWER_WIDTH, HEADER_HEIGHT, MINI_DRAWER_WIDTH } from "@/lib/tokens";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [desktop, setDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const onChange = () => {
      const isDesktop = mq.matches;
      setDesktop(isDesktop);
      if (!isDesktop) setOpen(false);
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="min-h-screen bg-berry">
      <Sidebar open={open} desktop={desktop} onClose={() => setOpen(false)} />
      <Navbar menuOpen={open} onMenu={() => setOpen((v) => !v)} />
      <main
        className="min-h-[calc(100vh-80px)] rounded-t-[8px] bg-berry-canvas p-4 text-berry-text transition-[margin] duration-[400ms] ease-out min-[600px]:p-5"
        style={{
          marginTop: HEADER_HEIGHT,
          marginLeft: desktop ? (open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH) : 16,
          marginRight: desktop ? 20 : 16,
        }}
      >
        <div
          className="mx-auto flex w-full flex-col px-6"
          style={{ maxWidth: CONTAINER_MAX }}
        >
          {children}
          <Footer />
        </div>
      </main>
      <CustomizeFab />
    </div>
  );
}
