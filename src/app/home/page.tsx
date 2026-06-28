"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ShoppingBag, UtensilsCrossed, Bike } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { FulfillmentPicker } from "@/components/home/fulfillment-picker";
import { HomeStatsRow } from "@/components/home/stats-row";
import { PromoCarousel } from "@/components/home/promo-carousel";
import { CafeCard } from "@/components/cafe/cafe-card";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import {
  APP_NAME,
  cafes,
  CAMPUS_NAME,
  promoBanners,
  orders as seedOrders,
} from "@/lib/data";
import { brandAssets } from "@/lib/brand";
import {
  formatEta,
  getActiveDeliveryStage,
  getEtaMinutesRemaining,
  isActiveOrder,
} from "@/lib/delivery";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  preparing: "bg-uitm-navy/8 text-uitm-navy border-uitm-navy/15",
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rider_assigned: "bg-purple-50 text-purple-700 border-purple-200",
  picked_up: "bg-indigo-50 text-indigo-700 border-indigo-200",
  on_the_way: "bg-uitm-navy/8 text-uitm-navy border-uitm-navy/15",
  nearby: "bg-uitm-magenta/10 text-uitm-magenta border-uitm-magenta/20",
};

export default function HomePage() {
  const router = useRouter();
  const {
    student,
    orders,
    cartItemCount,
    fulfillmentMode,
    setFulfillmentMode,
  } = useApp();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  const activeOrders = [...orders, ...seedOrders].filter((o) =>
    isActiveOrder(o, now)
  );
  const openCafes = cafes.filter((c) => c.isOpen).slice(0, 3);

  const handleFulfillmentSelect = (mode: typeof fulfillmentMode) => {
    setFulfillmentMode(mode);
    router.push("/cafes");
  };

  return (
    <MobileShell>
      <div className="bg-uitm-brand-subtle pb-6">
        {/* Header */}
        <div className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={brandAssets.appLogo}
                alt={APP_NAME}
                width={40}
                height={40}
                className="size-10 object-contain"
              />
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  {CAMPUS_NAME}
                </p>
                <h1 className="text-lg font-bold tracking-tight text-uitm-navy">
                  Hi, {student.name.split(" ")[0]} 👋
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/notifications" aria-label="Notifications">
                <Button variant="ghost" size="icon" className="size-10 rounded-full">
                  <Bell className="size-5 text-foreground/70" />
                </Button>
              </Link>
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
            </div>
          </header>

          <div className="mt-5">
            <HomeStatsRow />
          </div>
        </div>

        {/* Promo */}
        <div className="mt-5 px-4">
          <PromoCarousel banners={promoBanners} />
        </div>

        {/* Delivery / Pickup hero */}
        <div className="mt-8 px-4">
          <FulfillmentPicker
            value={fulfillmentMode}
            onChange={handleFulfillmentSelect}
            variant="hero"
          />
        </div>

        {/* Active order */}
        {activeOrders.length > 0 && (
          <section className="mt-8 px-4">
            <SectionHeader title="Active Order" href="/orders" linkLabel="View all" />
            {activeOrders.slice(0, 1).map((order) => {
              const cafe = cafes.find((c) => c.id === order.cafeId);
              const activeStage = getActiveDeliveryStage(order);
              const eta = getEtaMinutesRemaining(order, now);
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all active:scale-[0.99] hover:shadow-md"
                >
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
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
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        {order.fulfillmentType === "delivery" ? (
                          <>
                            <Bike className="size-3" />
                            {order.deliveryLocation?.label} · ETA {formatEta(eta)}
                          </>
                        ) : (
                          <>Pickup at {order.pickupTime}</>
                        )}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 border capitalize",
                        statusStyles[String(activeStage)] ??
                          "bg-muted text-muted-foreground"
                      )}
                    >
                      {String(activeStage).replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="bg-uitm-navy/5 px-4 py-2 text-center text-xs font-medium text-uitm-navy">
                    Tap to track live →
                  </div>
                </Link>
              );
            })}
          </section>
        )}

        {/* Popular cafes */}
        <section className="mt-8 px-4">
          <SectionHeader title="Popular on Campus" href="/cafes" />
          <div className="space-y-2.5">
            {openCafes.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} compact />
            ))}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
