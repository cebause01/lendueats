"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { AppImage } from "@/components/ui/app-image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/context/app-context";
import { formatCurrency, getCafeById, CAMPUS_NAME } from "@/lib/data";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const {
    cart,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    activeCafeId,
    activeDiscount,
  } = useApp();
  const cafe = activeCafeId ? getCafeById(activeCafeId) : null;
  const discount = activeDiscount?.amount ?? 0;
  const total = Math.max(0, cartTotal - discount);

  if (cart.length === 0) {
    return (
      <MobileShell>
        <PageHeader title="Your Cart" showBack />
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <div className="relative size-24 overflow-hidden rounded-full opacity-80">
            <AppImage src={images.logo} alt="Empty cart" fill />
          </div>
          <p className="mt-4 font-medium">Your cart is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse {CAMPUS_NAME} outlets to add items
          </p>
          <Link href="/cafes" className={buttonVariants({ className: "mt-6" })}>
            Browse Cafes
          </Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell showNav={false}>
      <PageHeader title="Your Cart" showBack />
      <div className="px-4 pb-32">
        {cafe && (
          <p className="mb-4 text-sm text-muted-foreground">
            Ordering from{" "}
            <span className="font-medium text-foreground">{cafe.name}</span>
          </p>
        )}

        <div className="space-y-3">
          {cart.map((item) => (
            <Card key={item.menuItem.id} className="border-border/60">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                  <AppImage src={item.menuItem.image} alt={item.menuItem.name} fill />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.menuItem.name}</p>
                  <p className="text-sm text-primary">
                    {formatCurrency(item.menuItem.price)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      updateCartQuantity(item.menuItem.id, item.quantity - 1)
                    }
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      updateCartQuantity(item.menuItem.id, item.quantity + 1)
                    }
                  >
                    <Plus className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeFromCart(item.menuItem.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 border-border/60">
          <CardContent className="space-y-2 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Reward Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Earn {Math.floor(total * 2)} LenduEats Points on this order
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t bg-background/95 p-4 backdrop-blur-lg pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Link
          href="/checkout"
          className={cn(buttonVariants(), "h-12 w-full text-base")}
        >
          Proceed to Checkout
        </Link>
      </div>
    </MobileShell>
  );
}
