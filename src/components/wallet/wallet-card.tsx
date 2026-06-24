"use client";

import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/app-context";
import { formatCurrency, tierBenefits } from "@/lib/data";

export function WalletCard() {
  const { student } = useApp();
  const tier = tierBenefits[student.tier];
  const progressToNext =
    student.tier === "Gold"
      ? 100
      : Math.min(100, (student.points / tier.pointsNeeded) * 100);

  return (
    <Card className="overflow-hidden border-0 bg-uitm-brand text-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">
              LenduEats Wallet
            </p>
            <p className="mt-1 text-[28px] font-semibold leading-none tracking-tight">
              {formatCurrency(student.walletBalance)}
            </p>
          </div>
          <Link
            href="/wallet"
            className="flex items-center gap-0.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
          >
            Top Up
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-4 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-uitm-gold" />
              <span className="text-sm font-medium">{student.points} pts</span>
            </div>
            <span className="rounded-md bg-uitm-gold px-1.5 py-0.5 text-[10px] font-semibold text-uitm-navy">
              {student.tier}
            </span>
          </div>
          {student.tier !== "Gold" && (
            <div className="mt-2">
              <Progress value={progressToNext} className="h-1 bg-white/20" />
              <p className="mt-1 text-[10px] text-white/70">
                {tier.pointsNeeded - student.points > 0
                  ? `${tier.pointsNeeded - student.points} pts to ${tier.nextTier}`
                  : `Ready for ${tier.nextTier}!`}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
