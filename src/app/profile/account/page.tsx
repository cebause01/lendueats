"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/app-context";
import { toast } from "sonner";

export default function AccountPage() {
  const router = useRouter();
  const { student } = useApp();
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState("012-345 6789");
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated successfully");
      router.push("/profile");
    }, 600);
  };

  return (
    <MobileShell showNav={false}>
      <PageHeader title="Account Details" showBack backHref="/profile" />

      <form onSubmit={handleSave} className="space-y-5 px-4 pb-8">
        <div className="flex flex-col items-center py-2">
          <Avatar className="size-24 ring-4 ring-uitm-magenta/15">
            <AvatarFallback className="bg-uitm-magenta text-2xl text-white">
              {student.avatar}
            </AvatarFallback>
          </Avatar>
        </div>

        <Card className="border-border/60">
          <CardContent className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input id="studentId" value={student.studentId} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty</Label>
              <Input id="faculty" value={student.faculty} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-uitm-navy-tint">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-uitm-navy">Membership</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {student.tier} tier · {student.points} LenduEats Points
            </p>
            <Button
              type="button"
              variant="link"
              className="mt-1 h-auto p-0 text-uitm-magenta"
              onClick={() => router.push("/rewards")}
            >
              View rewards & benefits →
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.push("/profile")}
        >
          Cancel
        </Button>
      </form>
    </MobileShell>
  );
}
