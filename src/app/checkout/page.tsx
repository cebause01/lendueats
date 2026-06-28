"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PaymentMethodIcon } from "@/components/wallet/payment-method-icon";
import { useApp } from "@/context/app-context";
import {
  formatCurrency,
  getCafeById,
  paymentMethods,
  preOrderSlots,
} from "@/lib/data";
import {
  DELIVERY_FEE,
  deliveryLocations,
  estimateDeliveryMinutes,
  formatEta,
} from "@/lib/delivery";
import type { FulfillmentType } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartTotal,
    activeCafeId,
    activeDiscount,
    student,
    placeOrder,
  } = useApp();
  const cafe = activeCafeId ? getCafeById(activeCafeId) : null;
  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("pickup");
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [pickupSlot, setPickupSlot] = useState(preOrderSlots[4].id);
  const [deliveryLocationId, setDeliveryLocationId] = useState(
    deliveryLocations[0].id
  );
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (cart.length === 0 && !success) {
      router.replace("/cart");
    }
  }, [cart.length, success, router]);

  const discount = activeDiscount?.amount ?? 0;
  const deliveryFee = fulfillmentType === "delivery" ? DELIVERY_FEE : 0;
  const total = Math.max(0, cartTotal + deliveryFee - discount);
  const selectedSlot = preOrderSlots.find((s) => s.id === pickupSlot);
  const etaMinutes =
    fulfillmentType === "delivery"
      ? estimateDeliveryMinutes(deliveryLocationId)
      : null;

  const handlePlaceOrder = () => {
    const order = placeOrder({
      isPreOrder: fulfillmentType === "pickup" && isPreOrder,
      pickupTime:
        fulfillmentType === "delivery"
          ? "ASAP"
          : selectedSlot?.time ?? "ASAP",
      paymentMethod,
      fulfillmentType,
      deliveryLocationId:
        fulfillmentType === "delivery" ? deliveryLocationId : undefined,
    });
    if (order) {
      setOrderId(order.id);
      setSuccess(true);
    }
  };

  if (cart.length === 0 && !success) {
    return (
      <MobileShell showNav={false}>
        <PageHeader title="Checkout" showBack backHref="/cart" />
        <p className="p-8 text-center text-muted-foreground">Redirecting...</p>
      </MobileShell>
    );
  }

  if (success) {
    return (
      <MobileShell showNav={false}>
        <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="size-10" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Order Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Your order{" "}
            <span className="font-medium text-foreground">{orderId}</span> is
            {fulfillmentType === "delivery"
              ? " on its way"
              : " being prepared"}
          </p>
          {fulfillmentType === "delivery" && etaMinutes && (
            <p className="mt-1 text-sm font-medium text-uitm-magenta">
              ETA {formatEta(etaMinutes)}
            </p>
          )}
          {fulfillmentType === "pickup" && isPreOrder && (
            <p className="mt-1 text-sm text-muted-foreground">
              Pick up at {selectedSlot?.time}
            </p>
          )}
          <p className="mt-4 text-sm">
            You earned{" "}
            <span className="font-semibold text-primary">
              {Math.floor(total * 2)} points
            </span>
          </p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <Button onClick={() => router.push(`/orders/${orderId}`)}>
              Track Order
            </Button>
            <Button variant="outline" onClick={() => router.push("/home")}>
              Back to Home
            </Button>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell showNav={false}>
      <PageHeader title="Checkout" showBack backHref="/cart" />
      <div className="space-y-5 px-4 pb-32">
        <section>
          <Label className="text-sm font-medium">How would you like it?</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[
              {
                value: "pickup" as const,
                label: "Pickup",
                icon: ShoppingBag,
                desc: "Collect at cafe",
              },
              {
                value: "delivery" as const,
                label: "Delivery",
                icon: Bike,
                desc: `+${formatCurrency(DELIVERY_FEE)} fee`,
              },
            ].map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFulfillmentType(opt.value)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-colors",
                    fulfillmentType === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <Icon className="size-5 text-uitm-magenta" />
                  <span className="text-sm font-medium">{opt.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {fulfillmentType === "pickup" && (
          <section>
            <Label className="text-sm font-medium">Pickup Option</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { value: false, label: "Order Now", icon: "⚡" },
                { value: true, label: "Pre-order", icon: "⏰" },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setIsPreOrder(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition-colors",
                    isPreOrder === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {fulfillmentType === "pickup" && isPreOrder && (
          <section>
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="size-4" />
              Pickup Time
            </Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {preOrderSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setPickupSlot(slot.id)}
                  className={cn(
                    "rounded-xl border-2 px-2 py-3 text-center transition-colors disabled:opacity-40",
                    pickupSlot === slot.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <p className="text-sm font-semibold">{slot.time}</p>
                  {!slot.available && (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Full
                    </p>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {fulfillmentType === "delivery" && (
          <section>
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="size-4" />
              Deliver To
            </Label>
            <div className="mt-2 space-y-2">
              {deliveryLocations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setDeliveryLocationId(loc.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors",
                    deliveryLocationId === loc.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-uitm-magenta" />
                  <div>
                    <p className="text-sm font-medium">{loc.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {loc.detail} · {loc.zone}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {etaMinutes && (
              <p className="mt-3 rounded-xl bg-uitm-navy/5 px-3 py-2 text-sm text-uitm-navy">
                Estimated delivery in{" "}
                <span className="font-semibold">{formatEta(etaMinutes)}</span>
              </p>
            )}
          </section>
        )}

        <section>
          <Label className="flex items-center gap-2 text-sm font-medium">
            <CreditCard className="size-4" />
            Payment Method
          </Label>
          <div className="mt-2 space-y-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 transition-colors",
                  paymentMethod === method.id
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                <PaymentMethodIcon icon={method.icon} />
                <div className="text-left">
                  <p className="text-sm font-medium">{method.name}</p>
                  {method.id === "wallet" && (
                    <p className="text-xs text-muted-foreground">
                      Balance: {formatCurrency(student.walletBalance)}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        <Card>
          <CardContent className="space-y-2 p-4">
            <p className="font-medium">{cafe?.name}</p>
            {cart.map((item) => (
              <div
                key={item.menuItem.id}
                className="flex justify-between text-sm text-muted-foreground"
              >
                <span>
                  {item.quantity}× {item.menuItem.name}
                </span>
                <span>
                  {formatCurrency(item.menuItem.price * item.quantity)}
                </span>
              </div>
            ))}
            {deliveryFee > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery fee</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button className="h-12 w-full text-base" onClick={handlePlaceOrder}>
          {fulfillmentType === "delivery" ? "Place Delivery Order" : "Place Order"}{" "}
          · {formatCurrency(total)}
        </Button>
      </div>
    </MobileShell>
  );
}
