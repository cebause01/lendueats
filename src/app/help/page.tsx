"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CAMPUS_NAME,
  CAMPUS_SUPPORT_EMAIL,
  CAMPUS_SUPPORT_PHONE,
  CAMPUS_SUPPORT_PHONE_DISPLAY,
} from "@/lib/data";
import { toast } from "sonner";

const faqs = [
  {
    q: "How do I top up my wallet?",
    a: "Go to Wallet → Top Up Wallet, choose an amount and pay via FPX or Touch 'n Go.",
    href: "/wallet",
    linkLabel: "Go to Wallet",
  },
  {
    q: "How do I pre-order food?",
    a: "Browse a cafe, add items to cart, then select Pre-order at checkout and pick a time slot.",
    href: "/pre-order",
    linkLabel: "Pre-order now",
  },
  {
    q: "How do Kampus Points work?",
    a: "Earn 2 points per RM 1 spent. Redeem points for free drinks, meals, and discounts.",
    href: "/rewards",
    linkLabel: "View rewards",
  },
  {
    q: "How do I scan & pay?",
    a: "Open the Pay tab, tap Open Camera & Scan, and point at the merchant QR code.",
    href: "/pay",
    linkLabel: "Open Scan & Pay",
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <MobileShell>
      <PageHeader title="Help & Support" showBack backHref="/profile" />

      <div className="space-y-4 px-4 pb-4">
        <Card className="border-border/60 bg-uitm-navy-tint">
          <CardContent className="p-5 text-center">
            <p className="font-medium text-uitm-navy">Need assistance?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {CAMPUS_NAME} campus support is here to help
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full gap-2 bg-white"
                onClick={() => toast.success("Live chat opened — demo mode")}
              >
                <MessageCircle className="size-4" />
                Live Chat
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 bg-white"
                onClick={() => {
                  window.location.href = `tel:${CAMPUS_SUPPORT_PHONE}`;
                }}
              >
                <Phone className="size-4" />
                Call {CAMPUS_SUPPORT_PHONE_DISPLAY}
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 bg-white"
                onClick={() => {
                  window.location.href = `mailto:${CAMPUS_SUPPORT_EMAIL}`;
                }}
              >
                <Mail className="size-4" />
                Email {CAMPUS_SUPPORT_EMAIL}
              </Button>
            </div>
          </CardContent>
        </Card>

        <section>
          <h2 className="mb-3 font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <Card key={faq.q} className="overflow-hidden border-border/60">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 p-4 text-left"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                  >
                    <span className="text-sm font-medium">{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <CardContent className="space-y-3 border-t pt-0 pb-4">
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-uitm-magenta"
                        onClick={() => router.push(faq.href)}
                      >
                        {faq.linkLabel} →
                      </Button>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        <Link href="/profile" className={buttonVariants({ variant: "outline", className: "w-full" })}>
          Back to Profile
        </Link>
      </div>
    </MobileShell>
  );
}
