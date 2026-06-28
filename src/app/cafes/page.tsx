"use client";

import { Search, Bike, ShoppingBag } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { CafeCard } from "@/components/cafe/cafe-card";
import { Input } from "@/components/ui/input";
import { cafes, CAMPUS_NAME } from "@/lib/data";
import { DELIVERY_FEE } from "@/lib/delivery";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";
import { useState } from "react";

type CafeFilter = "all" | "open";

export default function CafesPage() {
  const { fulfillmentMode, setFulfillmentMode } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CafeFilter>("all");

  const filtered = cafes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  const openCafes = filtered.filter((c) => c.isOpen);
  const displayCafes = filter === "open" ? openCafes : filtered;

  return (
    <MobileShell>
      <PageHeader
        title="Campus Cafes"
        subtitle={`Order from outlets across ${CAMPUS_NAME}`}
      />
      <div className="px-4">
        {/* Mode toggle */}
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-muted/80 p-1.5">
          {(
            [
              {
                id: "delivery" as const,
                label: "Delivery",
                icon: Bike,
                hint: `+RM ${DELIVERY_FEE.toFixed(2)}`,
              },
              {
                id: "pickup" as const,
                label: "Pickup",
                icon: ShoppingBag,
                hint: "At cafe",
              },
            ] as const
          ).map((mode) => {
            const Icon = mode.icon;
            const selected = fulfillmentMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setFulfillmentMode(mode.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all",
                  selected
                    ? "bg-white text-uitm-navy shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {mode.label}
                <span
                  className={cn(
                    "text-[10px] font-normal",
                    selected ? "text-uitm-magenta" : "text-muted-foreground"
                  )}
                >
                  {mode.hint}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cafes, food..."
            className="h-11 rounded-xl border-border/60 bg-card pl-10 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div
          role="tablist"
          aria-label="Filter cafes"
          className="grid grid-cols-2 gap-1.5 rounded-xl bg-muted/80 p-1"
        >
          {(
            [
              { id: "all" as const, label: `All (${filtered.length})` },
              { id: "open" as const, label: `Open (${openCafes.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                filter === tab.id
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="mt-4 space-y-3 pb-4">
          {displayCafes.map((cafe) => (
            <CafeCard key={cafe.id} cafe={cafe} />
          ))}
          {displayCafes.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {filter === "open" ? "No open cafes right now" : "No cafes found"}
            </p>
          )}
        </div>
      </div>
    </MobileShell>
  );
}
