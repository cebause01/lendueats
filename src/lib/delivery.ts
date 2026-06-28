import type {
  DeliveryLocation,
  DeliveryStage,
  FulfillmentType,
  Order,
  OrderStatus,
  TrackingStep,
} from "./types";

export const DELIVERY_FEE = 2.5;

export const deliveryLocations: DeliveryLocation[] = [
  {
    id: "loc-kpp1",
    label: "KPP1 Student Area",
    detail: "Block A, Ground Floor",
    zone: "KPP1",
  },
  {
    id: "loc-kpp2",
    label: "KPP2 Food Court",
    detail: "Main entrance, Level 1",
    zone: "KPP2",
  },
  {
    id: "loc-kpp3",
    label: "KPP3 Faculty Block",
    detail: "Lobby, Faculty Wing",
    zone: "KPP3",
  },
  {
    id: "loc-jebat",
    label: "Kolej Jebat",
    detail: "Common room, Block J1",
    zone: "Kolej",
  },
  {
    id: "loc-sabariah",
    label: "Kolej Tun Sabariah",
    detail: "Block TS2, Ground Floor",
    zone: "Kolej",
  },
  {
    id: "loc-library",
    label: "Perpustakaan KPP1",
    detail: "Reading area entrance",
    zone: "KPP1",
  },
];

const deliveryStageOrder: DeliveryStage[] = [
  "confirmed",
  "preparing",
  "ready",
  "rider_assigned",
  "picked_up",
  "on_the_way",
  "nearby",
  "delivered",
];

const pickupStageOrder = ["preparing", "ready", "completed"] as const;

const deliveryStageMeta: Record<
  DeliveryStage,
  { label: string; description: string }
> = {
  confirmed: {
    label: "Order confirmed",
    description: "Your order has been received by the cafe",
  },
  preparing: {
    label: "Preparing food",
    description: "The kitchen is preparing your items",
  },
  ready: {
    label: "Ready for pickup",
    description: "Food is packed and waiting for the rider",
  },
  rider_assigned: {
    label: "Rider assigned",
    description: "A campus rider is heading to the cafe",
  },
  picked_up: {
    label: "Order picked up",
    description: "Your rider has collected your order",
  },
  on_the_way: {
    label: "On the way",
    description: "Rider is en route to your location",
  },
  nearby: {
    label: "Rider nearby",
    description: "Your rider is almost at your location",
  },
  delivered: {
    label: "Delivered",
    description: "Enjoy your meal!",
  },
};

const pickupStageMeta: Record<
  "preparing" | "ready" | "completed",
  { label: string; description: string }
> = {
  preparing: {
    label: "Preparing",
    description: "Your order is being prepared",
  },
  ready: {
    label: "Ready for pickup",
    description: "Head to the cafe and show your QR code",
  },
  completed: {
    label: "Completed",
    description: "Order picked up successfully",
  },
};

/** Minutes from order placement to each delivery stage (demo simulation). */
const DELIVERY_STAGE_OFFSET_MIN: Record<DeliveryStage, number> = {
  confirmed: 0,
  preparing: 1,
  ready: 6,
  rider_assigned: 8,
  picked_up: 10,
  on_the_way: 12,
  nearby: 18,
  delivered: 22,
};

export function getDeliveryLocation(id: string): DeliveryLocation | undefined {
  return deliveryLocations.find((l) => l.id === id);
}

export function estimateDeliveryMinutes(locationId: string): number {
  const zone = getDeliveryLocation(locationId)?.zone;
  if (zone === "Kolej") return 28;
  if (zone === "KPP3") return 22;
  return 25;
}

export function computeEstimatedDeliveryAt(
  createdAt: string,
  locationId: string
): string {
  const mins = estimateDeliveryMinutes(locationId);
  return new Date(
    new Date(createdAt).getTime() + mins * 60 * 1000
  ).toISOString();
}

export function getSimulatedDeliveryStage(
  createdAt: string,
  now = Date.now()
): DeliveryStage {
  const elapsedMin = (now - new Date(createdAt).getTime()) / 60000;
  let stage: DeliveryStage = "confirmed";
  for (const s of deliveryStageOrder) {
    if (elapsedMin >= DELIVERY_STAGE_OFFSET_MIN[s]) stage = s;
  }
  return stage;
}

export function deliveryStageToStatus(stage: DeliveryStage): OrderStatus {
  if (stage === "delivered") return "completed";
  return stage;
}

export function getActiveDeliveryStage(order: Order): DeliveryStage | OrderStatus {
  if (order.fulfillmentType === "delivery") {
    if (order.status === "completed" || order.status === "cancelled") {
      return "delivered";
    }
    return getSimulatedDeliveryStage(order.createdAt);
  }
  return order.status;
}

export function getTrackingSteps(order: Order, now = Date.now()): TrackingStep[] {
  if (order.fulfillmentType === "delivery") {
    const current = getSimulatedDeliveryStage(order.createdAt, now);
    const currentIdx = deliveryStageOrder.indexOf(current);
    return deliveryStageOrder.map((stage, idx) => ({
      stage,
      label: deliveryStageMeta[stage].label,
      description: deliveryStageMeta[stage].description,
      completed: idx < currentIdx || (stage === "delivered" && current === "delivered"),
      active: idx === currentIdx,
      timestamp:
        idx <= currentIdx
          ? new Date(
              new Date(order.createdAt).getTime() +
                DELIVERY_STAGE_OFFSET_MIN[stage] * 60000
            ).toISOString()
          : undefined,
    }));
  }

  const status = order.status;
  const pickupStatus =
    status === "preparing" || status === "ready" || status === "completed"
      ? status
      : "preparing";
  const currentIdx = pickupStageOrder.indexOf(pickupStatus);
  return pickupStageOrder.map((stage, idx) => ({
    stage,
    label: pickupStageMeta[stage].label,
    description: pickupStageMeta[stage].description,
    completed: idx < currentIdx || pickupStatus === "completed",
    active: idx === currentIdx && pickupStatus !== "completed",
    timestamp: idx <= currentIdx ? order.createdAt : undefined,
  }));
}

export function getTrackingProgress(order: Order, now = Date.now()): number {
  const steps = getTrackingSteps(order, now);
  const completed = steps.filter((s) => s.completed).length;
  const active = steps.some((s) => s.active) ? 0.5 : 0;
  return Math.round(((completed + active) / steps.length) * 100);
}

export function getEtaMinutesRemaining(
  order: Order,
  now = Date.now()
): number | null {
  if (order.fulfillmentType !== "delivery" || !order.estimatedDeliveryAt) {
    return null;
  }
  if (order.status === "completed" || getSimulatedDeliveryStage(order.createdAt, now) === "delivered") {
    return 0;
  }
  const remaining = Math.ceil(
    (new Date(order.estimatedDeliveryAt).getTime() - now) / 60000
  );
  return Math.max(0, remaining);
}

export function formatEta(minutes: number | null): string {
  if (minutes === null) return "—";
  if (minutes <= 0) return "Arriving now";
  if (minutes === 1) return "1 min";
  return `${minutes} min`;
}

export function getDriverForOrder(orderId: string) {
  const drivers = [
    { name: "Amirul H.", phone: "+6012-345 6789", vehicle: "Motorcycle" },
    { name: "Siti N.", phone: "+6019-876 5432", vehicle: "Bicycle" },
    { name: "Hafiz R.", phone: "+6017-234 5678", vehicle: "Motorcycle" },
  ];
  const idx =
    orderId.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) %
    drivers.length;
  return drivers[idx];
}

export function isActiveOrder(order: Order, now = Date.now()): boolean {
  if (order.status === "cancelled") return false;
  if (order.fulfillmentType === "delivery") {
    return getSimulatedDeliveryStage(order.createdAt, now) !== "delivered";
  }
  return order.status === "preparing" || order.status === "ready";
}

export function fulfillmentLabel(type: FulfillmentType): string {
  return type === "delivery" ? "Delivery" : "Pickup";
}
