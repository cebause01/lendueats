"use client";

import { useState } from "react";
import { Fingerprint, Lock, ShieldCheck } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { CAMPUS_NAME } from "@/lib/data";
import { toast } from "sonner";

export default function PrivacyPage() {
  const router = useRouter();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password changed successfully");
    setPasswordOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <MobileShell>
      <PageHeader title="Privacy & Security" showBack backHref="/profile" />

      <div className="space-y-4 px-4 pb-4">
        <Card className="border-border/60">
          <CardContent className="space-y-4 p-4">
            <button
              type="button"
              className="flex w-full items-center gap-3 text-left"
              onClick={() =>
                toast.success("Biometric login toggled — demo mode")
              }
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-uitm-magenta/10 text-uitm-magenta">
                <Fingerprint className="size-5" />
              </div>
              <div className="flex-1">
                <Label htmlFor="biometric" className="text-sm font-medium">
                  Biometric Login
                </Label>
                <p className="text-xs text-muted-foreground">
                  Use fingerprint or Face ID
                </p>
              </div>
              <Switch
                id="biometric"
                defaultChecked
                onCheckedChange={(v) =>
                  toast.success(
                    v ? "Biometric login enabled" : "Biometric login disabled"
                  )
                }
                onClick={(e) => e.stopPropagation()}
              />
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 text-left"
              onClick={() =>
                toast.success("Payment PIN toggled — demo mode")
              }
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-uitm-magenta/10 text-uitm-magenta">
                <Lock className="size-5" />
              </div>
              <div className="flex-1">
                <Label htmlFor="pin" className="text-sm font-medium">
                  PIN for Payments
                </Label>
                <p className="text-xs text-muted-foreground">
                  Require PIN above RM 20
                </p>
              </div>
              <Switch
                id="pin"
                defaultChecked
                onCheckedChange={(v) =>
                  toast.success(
                    v ? "Payment PIN enabled" : "Payment PIN disabled"
                  )
                }
                onClick={(e) => e.stopPropagation()}
              />
            </button>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-uitm-navy">
              <ShieldCheck className="size-5" />
              <p className="font-medium">Your data is protected</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              LenduEats encrypts your payment data and never shares your personal
              information with third parties without consent. Transaction history
              is stored securely on {CAMPUS_NAME} campus servers.
            </p>
            <Button
              type="button"
              variant="link"
              className="mt-2 h-auto p-0 text-uitm-magenta"
              onClick={() => router.push("/profile/about")}
            >
              Read privacy policy →
            </Button>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setPasswordOpen(true)}
        >
          Change Password
        </Button>

        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => router.push("/profile")}
        >
          Back to Profile
        </Button>
      </div>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input
                id="current"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input
                id="new"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MobileShell>
  );
}
