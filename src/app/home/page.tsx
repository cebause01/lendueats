"use client";

import Link from "next/link";
import {
  ShoppingBag,
  UtensilsCrossed,
  Clock,
  Wallet,
  Gift,
} from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { WalletCard } from "@/components/wallet/wallet-card";
import { CafeCard } from "@/components/cafe/cafe-card";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/context/app-context";
import { cafes, CAMPUS_NAME, promoBanners, orders as seedOrders } from "@/lib/data";
import { cn } from "@/lib/utils";

const quickActions = [
  { href: "/cafes", label: "Order", icon: UtensilsCrossed },
  { href: "/pre-order", label: "Pre-order", icon: Clock },
  { href: "/wallet", label: "Top Up", icon: Wallet },
  { href: "/rewards", label: "Rewards", icon: Gift },
];

const statusStyles: Record<string, string> = {
  preparing: "bg-uitm-navy/8 text-uitm-navy border-uitm-navy/15",
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function HomePage() {
  const { student, orders, cartItemCount } = useApp();
  const activeOrders = [...orders, ...seedOrders].filter(
    (o) => o.status === "preparing" || o.status === "ready"
  );
  const openCafes = cafes.filter((c) => c.isOpen).slice(0, 3);

  return (
    <MobileShell>
      <div className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{CAMPUS_NAME} · Welcome back</p>
            <h1 className="text-xl font-semibold tracking-tight">
              {student.name.split(" ")[0]}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/cart" aria-label="Open cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative size-10 rounded-full"
              >
                <ShoppingBag className="size-5 text-foreground/80" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-uitm-magenta text-[10px] font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/profile" aria-label="Open profile">
              <Avatar className="size-10">
                <AvatarFallback className="bg-uitm-magenta/10 text-sm font-semibold text-uitm-magenta">
                  {student.avatar}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        <div className="mt-5">
          <WalletCard />
        </div>

        <div className="mt-5 flex gap-2.5 overflow-x-auto pb-0.5 scrollbar-none">
          {promoBanners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.href}
              className="relative min-w-[240px] shrink-0 overflow-hidden rounded-2xl active:opacity-90"
            >
              <div className="relative h-24">
                <AppImage src={banner.image} alt={banner.title} fill />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r opacity-85",
                    banner.color
                  )}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-3.5 text-white">
                  <p className="text-sm font-semibold leading-tight">
                    {banner.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/85">
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-1.5 rounded-2xl py-2.5 transition-colors active:bg-muted/50"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-muted/60 text-uitm-magenta">
                  <Icon className="size-[18px]" strokeWidth={1.75} />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>

        {activeOrders.length > 0 && (
          <section className="mt-7">
            <SectionHeader title="Active Orders" href="/orders" linkLabel="View all" />
            {activeOrders.slice(0, 1).map((order) => {
              const cafe = cafes.find((c) => c.id === order.cafeId);
              return (
                <Link key={order.id} href="/orders" className="block">
                  <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card px-3 py-3 transition-colors active:bg-muted/30">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-1 ring-border/50">
                      {cafe ? (
                        <AppImage src={cafe.image} alt={order.cafeName} fill />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-muted text-uitm-magenta">
                          <UtensilsCrossed className="size-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{order.cafeName}</p>
                      <p className="text-xs text-muted-foreground">
                        Pickup at {order.pickupTime}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 border capitalize",
                        statusStyles[order.status] ?? "bg-muted text-muted-foreground"
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </section>
        )}

        <section className="mt-7">
          <SectionHeader title="Campus Cafes" href="/cafes" />
          <div className="space-y-2">
            {openCafes.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} compact />
            ))}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
