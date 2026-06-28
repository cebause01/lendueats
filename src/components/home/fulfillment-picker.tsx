"use client";

import type { JSX } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { FulfillmentType } from "@/lib/types";

const DELIVERY_ICON = "/images/icons/delivery.png";
const PICKUP_ICON = "/images/icons/pickup.png";

function FulfillmentIcon({
  src,
  inset,
}: {
  src: string;
  inset: string;
}) {
  return (
    <div className={cn("absolute", inset)}>
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 640px) 140px, 140px"
        className="object-contain"
        aria-hidden
        draggable={false}
      />
    </div>
  );
}

function DeliveryIcon({ inset }: { inset: string }) {
  return <FulfillmentIcon src={DELIVERY_ICON} inset={inset} />;
}

function PickupIcon({ inset }: { inset: string }) {
  return <FulfillmentIcon src={PICKUP_ICON} inset={inset} />;
}

interface FulfillmentPickerProps {
  value: FulfillmentType;
  onChange: (mode: FulfillmentType) => void;
  variant?: "hero" | "compact";
  className?: string;
}

export function FulfillmentPicker({
  value,
  onChange,
  variant = "hero",
  className,
}: FulfillmentPickerProps) {
  const options: {
    type: FulfillmentType;
    label: string;
    Icon: ({ inset }: { inset: string }) => JSX.Element;
    iconBg: string;
    selectedBorder: string;
    selectedLabel: string;
  }[] = [
    {
      type: "delivery",
      label: "Delivery",
      Icon: DeliveryIcon,
      iconBg: "bg-white",
      selectedBorder: "border-uitm-navy ring-2 ring-uitm-navy/20",
      selectedLabel: "text-uitm-navy",
    },
    {
      type: "pickup",
      label: "Pickup",
      Icon: PickupIcon,
      iconBg: "bg-white",
      selectedBorder: "border-uitm-magenta ring-2 ring-uitm-magenta/20",
      selectedLabel: "text-uitm-magenta",
    },
  ];

  const isHero = variant === "hero";
  const outerSize = isHero ? "size-[132px] sm:size-[140px]" : "size-[88px]";
  const iconInset = isHero ? "inset-5 sm:inset-6" : "inset-3.5";

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("grid grid-cols-2", isHero ? "gap-6" : "gap-4")}>
        {options.map(({ type, label, Icon, iconBg, selectedBorder, selectedLabel }) => {
          const selected = value === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={cn(
                "group flex flex-col items-center transition-all active:scale-[0.98]",
                isHero ? "gap-2.5" : "gap-2"
              )}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-full border-2 transition-all duration-200",
                  outerSize,
                  iconBg,
                  selected
                    ? cn("border-[2.5px] shadow-md", selectedBorder)
                    : "border-border/50 hover:border-border"
                )}
              >
                <Icon inset={iconInset} />
              </div>
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.14em]",
                  selected
                    ? selectedLabel
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
