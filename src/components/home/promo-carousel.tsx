"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { cn } from "@/lib/utils";

interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  color: string;
}

interface PromoCarouselProps {
  banners: PromoBanner[];
}

export function PromoCarousel({ banners }: PromoCarouselProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
      {banners.map((banner) => (
        <Link
          key={banner.id}
          href={banner.href}
          className="relative min-w-[88%] shrink-0 snap-center overflow-hidden rounded-3xl shadow-md shadow-uitm-navy/10 transition-transform active:scale-[0.99]"
        >
          <div className="relative h-44">
            <AppImage src={banner.image} alt={banner.title} fill />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-90",
                banner.color
              )}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <div className="w-fit rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                Promo
              </div>
              <div>
                <p className="text-xl font-bold leading-tight text-white">
                  {banner.title}
                </p>
                <p className="mt-1.5 text-sm text-white/90">{banner.subtitle}</p>
                <span className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-uitm-navy">
                  Learn more
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
