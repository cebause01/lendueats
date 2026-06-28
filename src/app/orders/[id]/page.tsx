"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bike } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { OrderTrackingTimeline } from "@/components/orders/order-tracking-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/context/app-context";
import {
  formatCurrency,
  formatDate,
  formatTime,
  getCafeById,
  orders as seedOrders,
} from "@/lib/data";
import {
  fulfillmentLabel,
  getActiveDeliveryStage,
  getEtaMinutesRemaining,
  isActiveOrder,
} from "@/lib/delivery";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-700",
  ready: "bg-green-100 text-green-700",
  rider_assigned: "bg-purple-100 text-purple-700",
  picked_up: "bg-indigo-100 text-indigo-700",
  on_the_way: "bg-uitm-navy/10 text-uitm-navy",
  nearby: "bg-uitm-magenta/10 text-uitm-magenta",
  delivered: "bg-green-100 text-green-700",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-red-100 text-red-700",
};

function stageLabel(stage: string): string {
  return stage.replace(/_/g, " ");
}

export default function OrderTrackPage() {
  const params = useParams();
  const router = useRouter();
  const { orders } = useApp();
  const orderId = params.id as string;
  const [now, setNow] = useState(Date.now());

  const order = useMemo(
    () => [...orders, ...seedOrders].find((o) => o.id === orderId),
    [orders, orderId]
  );

  useEffect(() => {
    if (!order || !isActiveOrder(order)) return;
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, [order]);

  if (!order) {
    return (
      <MobileShell showNav={false}>
        <div className="px-4 py-16 text-center">
          <p className="font-medium">Order not found</p>
          <Button className="mt-4" onClick={() => router.push("/orders")}>
            Back to Orders
          </Button>
        </div>
      </MobileShell>
    );
  }

  const cafe = getCafeById(order.cafeId);
  const activeStage = getActiveDeliveryStage(order);
  const etaMinutes = getEtaMinutesRemaining(order, now);
  const active = isActiveOrder(order, now);

  return (
    <MobileShell showNav={false}>
      <header className="sticky top-0 z-40 border-b bg-background/95 px-4 py-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold">Track Order</h1>
            <p className="truncate text-xs text-muted-foreground">{order.id}</p>
          </div>
          <Badge
            className={cn(
              "shrink-0 capitalize",
              statusColors[String(activeStage)] ?? statusColors.preparing
            )}
          >
            {stageLabel(String(activeStage))}
          </Badge>
        </div>
      </header>

      <div className="space-y-4 px-4 py-4 pb-8">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{order.cafeName}</p>
                <p className="text-xs text-muted-foreground">
                  {cafe?.location} · {formatDate(order.createdAt)} at{" "}
                  {formatTime(order.createdAt)}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0 capitalize">
                {order.fulfillmentType === "delivery" ? (
                  <span className="flex items-center gap-1">
                    <Bike className="size-3" />
                    {fulfillmentLabel(order.fulfillmentType)}
                  </span>
                ) : (
                  fulfillmentLabel(order.fulfillmentType)
                )}
              </Badge>
            </div>

            <div className="mt-3 space-y-1">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm text-muted-foreground"
                >
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>
                {formatCurrency(order.total - (order.deliveryFee ?? 0))}
              </span>
            </div>
            {order.deliveryFee ? (
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery fee</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
            ) : null}
            <div className="mt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        <OrderTrackingTimeline order={order} etaMinutes={etaMinutes} now={now} />

        {active && (
          <Button className="w-full" onClick={() => router.push("/orders")}>
            View All Orders
          </Button>
        )}

        {!active && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/cafes")}
          >
            Order Again
          </Button>
        )}
      </div>
    </MobileShell>
  );
}
