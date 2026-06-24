"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  LogOut,
  Package,
  Wallet,
  Gift,
  Bell,
  HelpCircle,
  Shield,
  UserPen,
  Info,
} from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import {
  ProfileMenuRow,
  ProfileStatCard,
} from "@/components/profile/profile-menu-row";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/context/app-context";
import { formatCurrency, CAMPUS_NAME } from "@/lib/data";

const UNREAD_NOTIFICATIONS = 2;

export default function ProfilePage() {
  const router = useRouter();
  const { student, logout } = useApp();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <MobileShell>
      <PageHeader
        title="Profile"
        rightAction={
          <Button
            variant="ghost"
            size="sm"
            className="text-uitm-magenta"
            onClick={() => router.push("/profile/account")}
          >
            Edit
          </Button>
        }
      />

      <div className="px-4 pb-4">
        <Link href="/profile/account" className="block">
          <Card className="border-border/60 transition-all hover:border-uitm-magenta/30 hover:shadow-md active:scale-[0.99]">
            <CardContent className="flex items-center gap-4 p-5">
              <Avatar className="size-16 ring-2 ring-uitm-magenta/20">
                <AvatarFallback className="bg-uitm-magenta text-xl text-white">
                  {student.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold">{student.name}</h2>
                <p className="text-sm text-muted-foreground">{student.studentId}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {student.faculty}
                </p>
                <p className="mt-1 text-xs font-medium text-uitm-magenta">
                  View account details
                </p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <ProfileStatCard
            href="/wallet"
            label="Wallet"
            value={formatCurrency(student.walletBalance)}
            valueClassName="text-uitm-magenta"
          />
          <ProfileStatCard
            href="/rewards"
            label="Points"
            value={String(student.points)}
            valueClassName="text-uitm-gold"
          />
        </div>

        <Card className="mt-4 border-border/60">
          <CardContent className="p-0">
            <ProfileMenuRow
              href="/orders"
              label="My Orders"
              icon={Package}
              description="Track & view order history"
            />
            <Separator />
            <ProfileMenuRow
              href="/wallet"
              label="Kampus Wallet"
              icon={Wallet}
              description="Top up & transactions"
            />
            <Separator />
            <ProfileMenuRow
              href="/rewards"
              label="Rewards"
              icon={Gift}
              description="Redeem Kampus Points"
            />
            <Separator />
            <ProfileMenuRow
              href="/notifications"
              label="Notifications"
              icon={Bell}
              description="Orders, promos & alerts"
              badge={UNREAD_NOTIFICATIONS}
            />
            <Separator />
            <ProfileMenuRow
              href="/help"
              label="Help & Support"
              icon={HelpCircle}
              description="FAQ & contact us"
            />
            <Separator />
            <ProfileMenuRow
              href="/privacy"
              label="Privacy & Security"
              icon={Shield}
              description="Login & payment settings"
            />
            <Separator />
            <ProfileMenuRow
              href="/profile/account"
              label="Edit Profile"
              icon={UserPen}
              description="Update your details"
            />
            <Separator />
            <ProfileMenuRow
              href="/profile/about"
              label="About KampusKafe"
              icon={Info}
              description="Version & app info"
            />
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="mt-6 w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>

        <button
          type="button"
          onClick={() => router.push("/profile/about")}
          className="mt-6 w-full pb-2 text-center text-xs text-muted-foreground transition-colors hover:text-uitm-magenta"
        >
          KampusKafe v1.0.0 · {CAMPUS_NAME}, Melaka
        </button>
      </div>
    </MobileShell>
  );
}
