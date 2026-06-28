"use client";

import { Wallet, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatCurrency, tierBenefits } from "@/lib/data";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";

export function HomeStatsRow() {
  const { student } = useApp();
  const tier = tierBenefits[student.tier];
  const progress =
    student.tier === "Gold"
      ? 100
      : Math.min(100, (student.points / tier.pointsNeeded) * 100);

  const stats = [
    {
      label: "Wallet",
      value: formatCurrency(student.walletBalance),
      icon: Wallet,
      href: "/wallet",
      accent: "text-uitm-navy",
      bg: "bg-uitm-navy/8",
    },
    {
      label: student.tier,
      value: student.tier === "Gold" ? "Max" : `${Math.round(progress)}%`,
      icon: Crown,
      href: "/rewards",
      accent: "text-uitm-gold",
      bg: "bg-uitm-gold/15",
    },
    {
      label: "Points",
      value: `${student.points}`,
      icon: Sparkles,
      href: "/rewards",
      accent: "text-uitm-magenta",
      bg: "bg-uitm-magenta/10",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-border/50 bg-card p-3 shadow-sm transition-all active:scale-[0.98] hover:border-border hover:shadow-md"
          >
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-xl",
                stat.bg
              )}
            >
              <Icon className={cn("size-4", stat.accent)} strokeWidth={2} />
            </div>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-0.5 text-base font-bold tabular-nums tracking-tight text-foreground">
              {stat.value}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
