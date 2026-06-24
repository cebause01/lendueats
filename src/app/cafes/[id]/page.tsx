"use client";

import { use, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, MapPin, ShoppingBag, Star } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { MenuItemCard } from "@/components/cafe/menu-item-card";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/app-context";
import { formatCurrency, getCafeById, getMenuByCafe } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function CafeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const cafe = getCafeById(id);
  const menu = getMenuByCafe(id);
  const {
    setActiveCafeId,
    addToCart,
    cart,
    updateCartQuantity,
    cartItemCount,
    cartTotal,
  } = useApp();

  useEffect(() => {
    setActiveCafeId(id);
  }, [id, setActiveCafeId]);

  const categories = useMemo(() => {
    return [...new Set(menu.map((m) => m.category))];
  }, [menu]);

  const getQuantity = (menuItemId: string) =>
    cart.find((c) => c.menuItem.id === menuItemId)?.quantity ?? 0;

  if (!cafe) {
    return (
      <MobileShell showNav={false}>
        <PageHeader title="Not Found" showBack backHref="/cafes" />
        <p className="p-4 text-center text-muted-foreground">Cafe not found</p>
        <div className="px-4">
          <Button className="w-full" onClick={() => router.push("/cafes")}>
            Back to Cafes
          </Button>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell showNav={!cartItemCount}>
      <div className="relative h-48 w-full">
        <AppImage src={cafe.image} alt={cafe.name} fill priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20" />
        <button
          type="button"
          onClick={() => router.push("/cafes")}
          className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-3 flex size-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/45"
          aria-label="Go back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
          <h1 className="text-xl font-bold">{cafe.name}</h1>
          <p className="text-sm text-white/85">{cafe.category}</p>
        </div>
      </div>

      <div className="px-4 pb-28">
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex flex-wrap gap-1">
            {cafe.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {cafe.location}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {cafe.rating} ({cafe.reviewCount})
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" />
              {cafe.prepTime}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{cafe.openHours}</p>
        </div>

        {!cafe.isOpen ? (
          <div className="mt-6 rounded-xl border border-dashed p-6 text-center">
            <p className="font-medium">Currently Closed</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Opens {cafe.openHours.split("–")[0]?.trim()}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/cafes")}
            >
              Browse Open Cafes
            </Button>
          </div>
        ) : (
          <Tabs defaultValue={categories[0]} className="mt-5">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-full data-active:bg-primary data-active:text-primary-foreground"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((cat) => (
              <TabsContent key={cat} value={cat} className="mt-4 space-y-3">
                {menu
                  .filter((m) => m.category === cat)
                  .map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      quantity={getQuantity(item.id)}
                      onAdd={() => addToCart({ menuItem: item, quantity: 1 })}
                      onUpdateQuantity={(qty) => updateCartQuantity(item.id, qty)}
                    />
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {cartItemCount > 0 && (
        <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t bg-background/95 p-4 backdrop-blur-lg pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Link
            href="/cart"
            className={cn(buttonVariants(), "h-12 w-full gap-2 text-base")}
          >
            <ShoppingBag className="size-5" />
            View Cart ({cartItemCount}) · {formatCurrency(cartTotal)}
          </Link>
        </div>
      )}
    </MobileShell>
  );
}
