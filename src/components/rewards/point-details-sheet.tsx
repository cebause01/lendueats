"use client";

import { ArrowDownLeft, ArrowUpRight, Crown, History, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useApp } from "@/context/app-context";
import {
  CAMPUS_NAME,
  formatDate,
  formatTime,
  tierBenefits,
  tierDetails,
  transactions as seedTransactions,
} from "@/lib/data";
import { cn } from "@/lib/utils";

interface PointDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PointDetailsSheet({ open, onOpenChange }: PointDetailsSheetProps) {
  const { student, transactions } = useApp();
  const tier = tierBenefits[student.tier];
  const progressToNext =
    student.tier === "Gold"
      ? 100
      : Math.min(100, (student.points / tier.pointsNeeded) * 100);

  const pointActivities = [...transactions, ...seedTransactions]
    .filter((tx) => tx.pointsEarned !== undefined && tx.pointsEarned !== 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[88vh] flex-col gap-0 overflow-hidden rounded-t-2xl p-0"
      >
        <div className="shrink-0 px-4 pt-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" />

          <SheetHeader className="px-0 pb-0 text-left">
            <SheetTitle>Points & Rewards</SheetTitle>
            <SheetDescription>Your balance, tier benefits, and activity</SheetDescription>
          </SheetHeader>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
          <div className="mt-4 shrink-0 rounded-xl bg-uitm-brand p-5 text-white shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 shrink-0" />
              <span className="text-sm font-medium text-white/85">Current Balance</span>
            </div>
            <p className="mt-1 text-4xl font-bold leading-none text-white">
              {student.points.toLocaleString()}
              <span className="ml-1.5 text-lg font-semibold text-white/80">pts</span>
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <Badge className="shrink-0 border-0 bg-white/20 text-white hover:bg-white/20">
                {student.tier} · {tier.multiplier}× multiplier
              </Badge>
              {student.tier !== "Gold" && (
                <span className="text-xs text-white/80">
                  {tier.pointsNeeded - student.points} pts to {tier.nextTier}
                </span>
              )}
            </div>
            {student.tier !== "Gold" && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
            )}
          </div>

        <section className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Crown className="size-4 text-uitm-magenta" />
            Membership Tiers
          </h3>
          <div className="space-y-2">
            {tierDetails.map((detail) => {
              const isCurrent = student.tier === detail.tier;
              const isUnlocked = student.points >= detail.minPoints;

              return (
                <Card
                  key={detail.tier}
                  className={cn(
                    "border-border/60",
                    isCurrent && "border-uitm-magenta/40 bg-uitm-magenta-tint/30"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{detail.tier}</span>
                        {isCurrent && (
                          <Badge variant="secondary" className="text-[10px]">
                            Current
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {detail.minPoints === 0 ? "0+ pts" : `${detail.minPoints}+ pts`} ·{" "}
                        {detail.multiplier}×
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {detail.perks.map((perk) => (
                        <li
                          key={perk}
                          className={cn(
                            "text-xs",
                            isUnlocked ? "text-muted-foreground" : "text-muted-foreground/60"
                          )}
                        >
                          • {perk}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <History className="size-4 text-uitm-magenta" />
            Points Activity
          </h3>
          <div className="space-y-2">
            {pointActivities.map((tx) => {
              const earned = tx.pointsEarned ?? 0;
              const isPositive = earned > 0;

              return (
                <Card key={tx.id}>
                  <CardContent className="flex items-center gap-3 p-3">
                    <div
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full",
                        isPositive
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-600"
                      )}
                    >
                      {isPositive ? (
                        <ArrowDownLeft className="size-4" />
                      ) : (
                        <ArrowUpRight className="size-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(tx.date)} · {formatTime(tx.date)}
                      </p>
                    </div>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        isPositive ? "text-green-600" : "text-amber-600"
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {earned} pts
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="mt-6 rounded-xl border border-border/60 bg-uitm-gold-tint p-4">
          <p className="text-sm font-medium">How to earn more</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>• Earn 2 points for every RM 1 spent at {CAMPUS_NAME} outlets</li>
            <li>• Double points during promo weeks</li>
            <li>• Tier multipliers boost every purchase</li>
          </ul>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
