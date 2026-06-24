"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, FileText, Shield } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { APP_NAME, APP_TAGLINE, CAMPUS_ADDRESS, CAMPUS_FULL_NAME, CAMPUS_NAME } from "@/lib/data";
import { brandAssets } from "@/lib/brand";
import { toast } from "sonner";

export default function AboutPage() {
  const router = useRouter();

  return (
    <MobileShell showNav={false}>
      <PageHeader title="About" showBack backHref="/profile" />

      <div className="space-y-4 px-4 pb-8">
        <Card className="border-border/60">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Image
              src={brandAssets.appLogo}
              alt="UiTM"
              width={96}
              height={96}
              className="size-24 object-contain"
            />
            <h2 className="mt-4 text-xl font-bold text-uitm-navy">{APP_NAME}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{APP_TAGLINE}</p>
            <p className="mt-3 text-xs text-muted-foreground">Version 1.0.0</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-0">
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 active:bg-muted"
              onClick={() => toast.info("Terms of Service (demo)")}
            >
              <FileText className="size-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">Terms of Service</span>
              <ExternalLink className="size-4 text-muted-foreground" />
            </button>
            <Separator />
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 active:bg-muted"
              onClick={() => router.push("/privacy")}
            >
              <Shield className="size-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">Privacy Policy</span>
              <ExternalLink className="size-4 text-muted-foreground" />
            </button>
            <Separator />
            <Link
              href="/help"
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50 active:bg-muted"
            >
              <span className="flex-1 text-sm font-medium">Help & Support</span>
              <ExternalLink className="size-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-uitm-magenta-tint">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <p>
              {APP_NAME} is a campus food & convenience app for students at{" "}
              <span className="font-medium text-uitm-navy">{CAMPUS_FULL_NAME}</span>
              . Order food, top up your wallet, earn rewards, and pay with QR at
              outlets across the Lendu campus — KPP1, KPP2, and residential
              colleges.
            </p>
            <p className="mt-2 text-xs">{CAMPUS_ADDRESS}</p>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/profile")}
        >
          Back to Profile
        </Button>
      </div>
    </MobileShell>
  );
}
