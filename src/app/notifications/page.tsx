"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Gift, Package, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const notifications = [
  {
    id: "n-1",
    title: "Order Ready for Pickup",
    body: "Your order ORD-2847 at Cafe Bentara is being prepared. Pickup at 12:30 PM.",
    time: "10 min ago",
    unread: true,
    href: "/orders",
    icon: Package,
  },
  {
    id: "n-2",
    title: "Double Points Week",
    body: "Earn 2× LenduEats Points on all orders this week. Don't miss out!",
    time: "2 hours ago",
    unread: true,
    href: "/rewards",
    icon: Gift,
  },
  {
    id: "n-3",
    title: "Wallet Top-up Successful",
    body: "RM 50.00 has been added to your LenduEats Wallet via FPX.",
    time: "Yesterday",
    unread: false,
    href: "/wallet",
    icon: Sparkles,
  },
  {
    id: "n-4",
    title: "New Reward Available",
    body: "Redeem a free Latte at Cafe Richiamo for 300 points.",
    time: "2 days ago",
    unread: false,
    href: "/rewards",
    icon: Gift,
  },
];

export default function NotificationsPage() {
  const [read, setRead] = useState<Set<string>>(new Set());

  const markAllRead = () => {
    setRead(new Set(notifications.map((n) => n.id)));
    toast.success("All notifications marked as read");
  };

  const markRead = (id: string) => {
    setRead((prev) => new Set([...prev, id]));
  };

  const unreadCount = notifications.filter(
    (n) => n.unread && !read.has(n.id)
  ).length;

  return (
    <MobileShell>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
        showBack
        backHref="/profile"
      />

      <div className="space-y-3 px-4 pb-4">
        {notifications.map((n) => {
          const isUnread = n.unread && !read.has(n.id);
          const Icon = n.icon;
          return (
            <Link
              key={n.id}
              href={n.href}
              onClick={() => markRead(n.id)}
              className="block"
            >
              <Card
                className={cn(
                  "border-border/60 transition-all hover:border-uitm-magenta/30 active:scale-[0.99]",
                  isUnread && "border-uitm-magenta/20 bg-uitm-magenta-tint"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-uitm-magenta/10 text-uitm-magenta">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {n.body}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {n.time} · Tap to open
                        </p>
                      </div>
                    </div>
                    {isUnread && (
                      <Badge className="shrink-0 bg-uitm-magenta text-white hover:bg-uitm-magenta">
                        New
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}

        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          <Bell className="mr-2 size-4" />
          Mark All as Read
        </Button>

        <Link
          href="/profile"
          className={buttonVariants({ variant: "ghost", className: "w-full" })}
        >
          Back to Profile
        </Link>
      </div>
    </MobileShell>
  );
}
