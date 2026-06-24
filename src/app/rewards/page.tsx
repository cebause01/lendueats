"use client";

import { useState } from "react";
import { ChevronRight, Gift, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PointDetailsSheet } from "@/components/rewards/point-details-sheet";
import { AppImage } from "@/components/ui/app-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/app-context";
import { rewards, tierBenefits } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function RewardsPage() {
  const { student, redeemReward, redeemedRewards } = useApp();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const tier = tierBenefits[student.tier];
  const progressToNext =
    student.tier === "Gold"
      ? 100
      : Math.min(100, (student.points / tier.pointsNeeded) * 100);

  return (
    <MobileShell>
      <PageHeader title="LenduEats Rewards" subtitle="Earn & redeem points" />

      <div className="px-4">
        <Card
          role="button"
          tabIndex={0}
          onClick={() => setDetailsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setDetailsOpen(true);
            }
          }}
          className="cursor-pointer overflow-hidden border-0 bg-uitm-brand text-white shadow-lg shadow-uitm-navy/15 transition-transform active:scale-[0.99]"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5" />
                <span className="text-sm font-medium text-white/85">Your Points</span>
              </div>
              <ChevronRight className="size-4 text-white/70" />
            </div>
            <p className="mt-1 text-4xl font-bold">{student.points}</p>
            <div className="mt-4 flex items-center justify-between">
              <Badge className="bg-white/20 text-white hover:bg-white/20">
                {student.tier} · {tier.multiplier}× multiplier
              </Badge>
              {student.tier !== "Gold" && (
                <span className="text-xs text-white/80">
                  {tier.pointsNeeded - student.points} to {tier.nextTier}
                </span>
              )}
            </div>
            {student.tier !== "Gold" && (
              <Progress value={progressToNext} className="mt-2 h-1.5 bg-white/25" />
            )}
          </CardContent>
        </Card>

        <PointDetailsSheet open={detailsOpen} onOpenChange={setDetailsOpen} />

        <div className="mt-4 rounded-xl border border-border/60 bg-uitm-gold-tint p-4">
          <p className="text-sm font-medium">How it works</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>• Earn 2 points for every RM 1 spent at Lendu outlets</li>
            <li>• Double points during promo weeks</li>
            <li>• Redeem for free drinks, meals & discounts</li>
          </ul>
        </div>

        <section className="mt-6 pb-4">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <Gift className="size-4 text-uitm-magenta" />
            Available Rewards
          </h2>
          <div className="space-y-3">
            {rewards.map((reward) => {
              const redeemed = redeemedRewards.includes(reward.id);
              const canAfford = student.points >= reward.pointsCost;

              return (
                <Card
                  key={reward.id}
                  className={cn("border-border/60", redeemed && "opacity-60")}
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                      <AppImage src={reward.image} alt={reward.name} fill />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{reward.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {reward.description}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {reward.pointsCost} pts
                        </Badge>
                        {reward.expiresIn && (
                          <span className="text-[10px] text-muted-foreground">
                            Valid {reward.expiresIn}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={redeemed ? "secondary" : "default"}
                      disabled={redeemed || !canAfford}
                      onClick={() => redeemReward(reward)}
                    >
                      {redeemed ? "Redeemed" : "Redeem"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
