"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Minus, Plus, Trash2 } from "lucide-react";
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
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    activeCafeId,
    activeDiscount,
  } = useApp();
  const cafe = activeCafeId ? getCafeById(activeCafeId) : null;
  const discount = activeDiscount?.amount ?? 0;
  const total = Math.max(0, cartTotal - discount);

  const handleClearCart = () => {
    if (window.confirm("Clear your cart and go back to home?")) {
      clearCart();
      toast.info("Cart cleared");
      router.push("/home");
    }
  };

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
          <Link
            href="/home"
            className={buttonVariants({ variant: "outline", className: "mt-3" })}
          >
            Back to Home
          </Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <PageHeader
        title="Your Cart"
        showBack
        backHref="/cafes"
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
      <div className="px-4 pb-44">
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

      <div className="fixed bottom-[4.75rem] left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t bg-background/95 p-4 backdrop-blur-lg">
        <Link
          href="/checkout"
          className={cn(buttonVariants(), "h-12 w-full text-base")}
        >
          Proceed to Checkout
        </Link>
        <Button
          variant="ghost"
          className="mt-2 h-10 w-full text-destructive hover:bg-destructive/5 hover:text-destructive"
          onClick={handleClearCart}
        >
          Cancel order & go home
        </Button>
      </div>
    </MobileShell>
  );
}
