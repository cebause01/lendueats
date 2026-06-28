"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bike, ChevronRight, Clock, MapPin, QrCode } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/context/app-context";
import {
  formatCurrency,
  formatDate,
  orders as seedOrders,
} from "@/lib/data";
import {
  formatEta,
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

export default function OrdersPage() {
  const { orders } = useApp();
  const router = useRouter();
  const [now, setNow] = useState(Date.now());
  const allOrders = useMemo(
    () => [...orders, ...seedOrders],
    [orders]
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <MobileShell>
      <PageHeader title="My Orders" subtitle="Track & view history" showBack />

      <div className="space-y-4 px-4 pb-4">
        {allOrders.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-5xl">📦</span>
            <p className="mt-4 font-medium">No orders yet</p>
            <Button className="mt-4" onClick={() => router.push("/cafes")}>
              Browse Cafes
            </Button>
          </div>
        ) : (
          allOrders.map((order) => {
            const activeStage = getActiveDeliveryStage(order);
            const active = isActiveOrder(order, now);
            const eta = getEtaMinutesRemaining(order, now);

            return (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{order.cafeName}</p>
                        {order.fulfillmentType === "delivery" && (
                          <Badge
                            variant="outline"
                            className="gap-1 text-[10px] capitalize"
                          >
                            <Bike className="size-3" />
                            Delivery
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.id} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        "shrink-0 capitalize",
                        statusColors[String(activeStage)] ?? statusColors.preparing
                      )}
                    >
                      {String(activeStage).replace(/_/g, " ")}
                    </Badge>
                  </div>

                  {order.fulfillmentType === "delivery" &&
                    order.deliveryLocation &&
                    active && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-uitm-navy/5 px-3 py-2 text-sm">
                        <MapPin className="size-4 shrink-0 text-uitm-magenta" />
                        <span className="truncate text-uitm-navy">
                          {order.deliveryLocation.label}
                        </span>
                        {eta !== null && (
                          <span className="ml-auto shrink-0 font-semibold text-uitm-magenta">
                            {formatEta(eta)}
                          </span>
                        )}
                      </div>
                    )}

                  <div className="mt-3 space-y-1">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm text-muted-foreground"
                      >
                        <span>
                          {item.quantity}× {item.name}
                        </span>
                        <span>
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        {formatCurrency(order.total)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        +{order.pointsEarned} points
                        {order.isPreOrder && " · Pre-order"}
                        {order.deliveryFee
                          ? ` · Delivery ${formatCurrency(order.deliveryFee)}`
                          : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      {order.fulfillmentType === "pickup" ? (
                        <>
                          <p className="text-xs text-muted-foreground">
                            Pickup
                          </p>
                          <p className="text-sm font-medium">
                            {order.pickupTime}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-muted-foreground">ETA</p>
                          <p className="flex items-center justify-end gap-1 text-sm font-medium">
                            <Clock className="size-3.5" />
                            {formatEta(eta)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {active && (
                    <Button
                      className="mt-4 w-full"
                      variant="outline"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      Track Order
                      <ChevronRight className="size-4" />
                    </Button>
                  )}

                  {order.fulfillmentType === "pickup" &&
                    (order.status === "preparing" ||
                      order.status === "ready") && (
                      <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                        <QrCode className="size-8 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Show this at pickup
                          </p>
                          <p className="font-mono text-sm font-semibold">
                            {order.qrCode}
                          </p>
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </MobileShell>
  );
}
