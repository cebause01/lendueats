"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME, CAMPUS_NAME, DEMO_CREDENTIALS } from "@/lib/data";
import { brandAssets } from "@/lib/brand";
import { useApp } from "@/context/app-context";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (login(studentId, password)) {
        router.push("/home");
      } else {
        toast.error("Invalid student ID or password");
      }
      setLoading(false);
    }, 600);
  };

  const fillDemo = () => {
    setStudentId(DEMO_CREDENTIALS.studentId);
    setPassword(DEMO_CREDENTIALS.password);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-uitm-brand-subtle px-4 py-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-block overflow-hidden rounded-2xl shadow-md ring-1 ring-border/60">
            <Image
              src={brandAssets.appLogo}
              alt="Universiti Teknologi MARA"
              width={96}
              height={96}
              className="size-24 object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-uitm-navy">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            For {CAMPUS_NAME} students · Sign in to continue
          </p>
        </div>

        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-uitm-navy">
              <GraduationCap className="size-5 text-uitm-magenta" />
              Student Login
            </CardTitle>
            <CardDescription>
              Use your UiTM student ID to access {CAMPUS_NAME} services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="e.g. 2025893182"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  inputMode="numeric"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-1/2 right-1 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <Button
              variant="outline"
              className="mt-4 w-full border-uitm-navy/20 text-uitm-navy hover:bg-uitm-navy/5"
              onClick={fillDemo}
              type="button"
            >
              Use Demo Account
            </Button>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Demo: {DEMO_CREDENTIALS.studentId} / {DEMO_CREDENTIALS.password}
        </p>
      </div>
    </div>
  );
}
