"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Home,
  MapPin,
} from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { FulfillmentPicker } from "@/components/home/fulfillment-picker";
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
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartTotal,
    activeCafeId,
    activeDiscount,
    student,
    placeOrder,
    fulfillmentMode,
    setFulfillmentMode,
    clearCart,
  } = useApp();
  const cafe = activeCafeId ? getCafeById(activeCafeId) : null;
  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>(fulfillmentMode);
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

  useEffect(() => {
    setFulfillmentType(fulfillmentMode);
  }, [fulfillmentMode]);

  useEffect(() => {
    setFulfillmentMode(fulfillmentType);
  }, [fulfillmentType, setFulfillmentMode]);

  const discount = activeDiscount?.amount ?? 0;
  const deliveryFee = fulfillmentType === "delivery" ? DELIVERY_FEE : 0;
  const total = Math.max(0, cartTotal + deliveryFee - discount);
  const selectedSlot = preOrderSlots.find((s) => s.id === pickupSlot);
  const etaMinutes =
    fulfillmentType === "delivery"
      ? estimateDeliveryMinutes(deliveryLocationId)
      : null;

  const handleCancelOrder = () => {
    if (
      window.confirm(
        "Cancel this order and clear your cart? You can start a new order anytime."
      )
    ) {
      clearCart();
      toast.info("Order cancelled");
      router.push("/home");
    }
  };

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
      <MobileShell>
        <PageHeader title="Checkout" showBack backHref="/cart" />
        <p className="p-8 text-center text-muted-foreground">Redirecting...</p>
      </MobileShell>
    );
  }

  if (success) {
    return (
      <MobileShell>
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
    <MobileShell>
      <PageHeader
        title="Checkout"
        showBack
        backHref="/cart"
        rightAction={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => router.push("/home")}
          >
            <Home className="size-4" />
            Home
          </Button>
        }
      />
      <div className="space-y-6 px-4 pb-44">
        <section className="rounded-3xl border border-border/50 bg-card p-5 shadow-sm">
          <FulfillmentPicker
            value={fulfillmentType}
            onChange={setFulfillmentType}
            variant="compact"
          />
        </section>

        {fulfillmentType === "pickup" && (
          <section className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
            <Label className="text-sm font-semibold text-uitm-navy">
              Pickup Option
            </Label>
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
          <section className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
            <Label className="flex items-center gap-2 text-sm font-semibold text-uitm-navy">
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
          <section className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
            <Label className="flex items-center gap-2 text-sm font-semibold text-uitm-navy">
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

        <section className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
          <Label className="flex items-center gap-2 text-sm font-semibold text-uitm-navy">
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

        <Card className="border-border/50 shadow-sm">
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

      <div className="fixed bottom-[4.75rem] left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t bg-background/95 p-4 backdrop-blur-lg">
        <Button className="h-12 w-full text-base" onClick={handlePlaceOrder}>
          {fulfillmentType === "delivery" ? "Place Delivery Order" : "Place Order"}{" "}
          · {formatCurrency(total)}
        </Button>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-10"
            onClick={() => router.push("/cart")}
          >
            Edit cart
          </Button>
          <Button
            variant="ghost"
            className="h-10 text-destructive hover:bg-destructive/5 hover:text-destructive"
            onClick={handleCancelOrder}
          >
            Cancel order
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
