"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function AppImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
}: AppImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          fill ? "absolute inset-0" : "",
          className
        )}
        style={!fill ? { width: width ?? 80, height: height ?? 80 } : undefined}
      >
        <ImageOff className="size-6 opacity-40" />
      </div>
    );
  }

  if (fill) {
    const isLocalAsset =
      src.startsWith("/images/") || src.startsWith("/brand/");

    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized={isLocalAsset}
        onError={() => setError(true)}
        className={cn("object-cover", className)}
        sizes="(max-width: 448px) 100vw, 448px"
      />
    );
  }

  const isLocalAsset =
    src.startsWith("/images/") || src.startsWith("/brand/");

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 80}
      height={height ?? 80}
      priority={priority}
      unoptimized={isLocalAsset}
      onError={() => setError(true)}
      className={cn("object-cover", className)}
    />
  );
}
