"use client";

import { Search } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { CafeCard } from "@/components/cafe/cafe-card";
import { Input } from "@/components/ui/input";
import { cafes, CAMPUS_NAME } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useState } from "react";

type CafeFilter = "all" | "open";

export default function CafesPage() {
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
        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cafes, food..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div
          role="tablist"
          aria-label="Filter cafes"
          className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
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
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                filter === tab.id
                  ? "bg-background text-foreground shadow-sm"
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
