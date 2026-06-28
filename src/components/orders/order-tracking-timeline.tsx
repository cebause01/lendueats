"use client";

import {
  Check,
  Circle,
  Loader2,
  MapPin,
  Package,
  Truck,
  UtensilsCrossed,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import {
  formatEta,
  getActiveDeliveryStage,
  getDriverForOrder,
  getTrackingProgress,
  getTrackingSteps,
} from "@/lib/delivery";
import { formatTime } from "@/lib/data";
import type { Order } from "@/lib/types";
import { cn } from "@/lib/utils";

const stageIcons: Record<string, typeof Package> = {
  confirmed: Package,
  preparing: UtensilsCrossed,
  ready: Package,
  rider_assigned: User,
  picked_up: Truck,
  on_the_way: Truck,
  nearby: MapPin,
  delivered: Check,
  completed: Check,
};

interface OrderTrackingTimelineProps {
  order: Order;
  etaMinutes: number | null;
  now: number;
}

export function OrderTrackingTimeline({
  order,
  etaMinutes,
  now,
}: OrderTrackingTimelineProps) {
  const steps = getTrackingSteps(order, now);
  const progress = getTrackingProgress(order, now);
  const activeStage = getActiveDeliveryStage(order);
  const driver =
    order.fulfillmentType === "delivery" &&
    ["rider_assigned", "picked_up", "on_the_way", "nearby"].includes(
      String(activeStage)
    )
      ? {
          name: order.driverName ?? getDriverForOrder(order.id).name,
          phone: order.driverPhone ?? getDriverForOrder(order.id).phone,
          vehicle: getDriverForOrder(order.id).vehicle,
        }
      : null;

  return (
    <div className="space-y-4">
      {order.fulfillmentType === "delivery" && etaMinutes !== null && (
        <Card className="overflow-hidden border-uitm-navy/20 bg-gradient-to-br from-uitm-navy to-uitm-magenta text-white">
          <CardContent className="p-5">
            <p className="text-sm text-white/80">Estimated arrival</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">
              {formatEta(etaMinutes)}
            </p>
            {order.estimatedDeliveryAt && etaMinutes > 0 && (
              <p className="mt-2 text-sm text-white/85">
                By {formatTime(order.estimatedDeliveryAt)}
              </p>
            )}
            <div className="mt-4">
              <Progress value={progress} className="gap-0">
                <ProgressTrack className="h-1.5 bg-white/25">
                  <ProgressIndicator className="bg-uitm-gold" />
                </ProgressTrack>
              </Progress>
              <p className="mt-2 text-xs text-white/75">{progress}% complete</p>
            </div>
          </CardContent>
        </Card>
      )}

      {driver && (
        <Card className="border-border/60">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-uitm-navy/10 text-uitm-navy">
              <Truck className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{driver.name}</p>
              <p className="text-xs text-muted-foreground">
                {driver.vehicle} · Campus rider
              </p>
            </div>
            <a
              href={`tel:${driver.phone.replace(/\s/g, "")}`}
              className="rounded-xl bg-uitm-navy px-3 py-2 text-xs font-medium text-white"
            >
              Call
            </a>
          </CardContent>
        </Card>
      )}

      {order.deliveryLocation && (
        <Card className="border-border/60">
          <CardContent className="flex items-start gap-3 p-4">
            <MapPin className="mt-0.5 size-5 shrink-0 text-uitm-magenta" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Deliver to
              </p>
              <p className="font-semibold">{order.deliveryLocation.label}</p>
              <p className="text-sm text-muted-foreground">
                {order.deliveryLocation.detail}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/60">
        <CardContent className="p-4">
          <p className="mb-4 text-sm font-semibold">Order progress</p>
          <ol className="space-y-0">
            {steps.map((step, idx) => {
              const Icon = stageIcons[String(step.stage)] ?? Circle;
              const isLast = idx === steps.length - 1;

              return (
                <li key={`${step.stage}-${idx}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full border-2",
                        step.completed &&
                          "border-green-500 bg-green-500 text-white",
                        step.active &&
                          "border-uitm-magenta bg-uitm-magenta/10 text-uitm-magenta",
                        !step.completed &&
                          !step.active &&
                          "border-muted bg-muted/40 text-muted-foreground"
                      )}
                    >
                      {step.active ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : step.completed ? (
                        <Check className="size-4" />
                      ) : (
                        <Icon className="size-4" />
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={cn(
                          "my-1 w-0.5 flex-1 min-h-8",
                          step.completed ? "bg-green-400" : "bg-border"
                        )}
                      />
                    )}
                  </div>
                  <div className={cn("pb-6", isLast && "pb-0")}>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        step.active && "text-uitm-magenta",
                        !step.completed && !step.active && "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                    {step.timestamp && (step.completed || step.active) && (
                      <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                        {formatTime(step.timestamp)}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
