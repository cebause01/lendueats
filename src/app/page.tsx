"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { APP_NAME, APP_TAGLINE, CAMPUS_NAME } from "@/lib/data";
import { brandAssets } from "@/lib/brand";
import { useApp } from "@/context/app-context";

export default function SplashPage() {
  const router = useRouter();
  const { isAuthenticated } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(isAuthenticated ? "/home" : "/login");
    }, 1800);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-uitm-brand px-6 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(255,179,0,0.12)_100%)]" />
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src={brandAssets.appLogo}
          alt="Universiti Teknologi MARA"
          width={120}
          height={120}
          className="size-28 rounded-2xl object-contain shadow-2xl"
          priority
        />
        <h1 className="mt-8 text-3xl font-bold tracking-tight">{APP_NAME}</h1>
        <p className="mt-2 text-center text-sm text-white/90">{APP_TAGLINE}</p>
        <p className="mt-6 text-xs font-medium tracking-wide text-uitm-gold uppercase">
          {CAMPUS_NAME} Students
        </p>
        <div className="mt-10 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="size-2 animate-pulse rounded-full bg-white/70"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
