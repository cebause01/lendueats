import Link from "next/link";
import { ChevronRight, Star, Clock } from "lucide-react";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import type { Cafe } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CafeCardProps {
  cafe: Cafe;
  compact?: boolean;
}

export function CafeCard({ cafe, compact }: CafeCardProps) {
  if (compact) {
    return (
      <Link
        href={`/cafes/${cafe.id}`}
        className="group flex items-center gap-3.5 rounded-2xl border border-border/40 bg-card px-3.5 py-3.5 shadow-sm transition-all hover:border-border hover:shadow-md active:scale-[0.99]"
      >
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full ring-1 ring-border/50">
          <AppImage src={cafe.image} alt={cafe.name} fill />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{cafe.name}</h3>
            {!cafe.isOpen && (
              <Badge variant="secondary" className="h-5 shrink-0 px-1.5 text-[10px]">
                Closed
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{cafe.category}</p>
          <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {cafe.rating}
              <span className="text-muted-foreground/70">({cafe.reviewCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {cafe.prepTime}
            </span>
          </div>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 group-hover:text-uitm-magenta" />
      </Link>
    );
  }

  return (
    <Link href={`/cafes/${cafe.id}`} className="block">
      <article
        className={cn(
          "overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all hover:shadow-md",
          !cafe.isOpen && "opacity-70"
        )}
      >
        <div className="relative h-36 w-full">
          <AppImage src={cafe.image} alt={cafe.name} fill />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          {!cafe.isOpen && (
            <Badge className="absolute top-3 right-3 border-0 bg-black/50 text-white">
              Closed
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold leading-tight">{cafe.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{cafe.category}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {cafe.rating} ({cafe.reviewCount})
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {cafe.prepTime}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
