"use client";

import { BottomNav } from "./bottom-nav";

interface MobileShellProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function MobileShell({ children, showNav = true }: MobileShellProps) {
  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-md bg-background shadow-2xl shadow-uitm-navy/10 ring-1 ring-border/40">
      <main className={showNav ? "pb-24" : ""}>{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
}
