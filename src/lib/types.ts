export type OrderStatus =
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled"
  | "confirmed"
  | "rider_assigned"
  | "picked_up"
  | "on_the_way"
  | "nearby"
  | "delivered";

export type FulfillmentType = "pickup" | "delivery";

export type DeliveryStage =
  | "confirmed"
  | "preparing"
  | "ready"
  | "rider_assigned"
  | "picked_up"
  | "on_the_way"
  | "nearby"
  | "delivered";

export interface DeliveryLocation {
  id: string;
  label: string;
  detail: string;
  zone: string;
}

export interface TrackingStep {
  stage: DeliveryStage | OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  active: boolean;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  faculty: string;
  avatar: string;
  walletBalance: number;
  points: number;
  tier: "Bronze" | "Silver" | "Gold";
}

export interface Cafe {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  openHours: string;
  image: string;
  category: string;
  prepTime: string;
  isOpen: boolean;
  tags: string[];
}

export interface MenuItem {
  id: string;
  cafeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  vegetarian?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: "drink" | "discount" | "meal";
  image: string;
  expiresIn?: string;
}

export interface Transaction {
  id: string;
  type: "topup" | "payment" | "refund" | "reward";
  amount: number;
  date: string;
  description: string;
  pointsEarned?: number;
}

export interface Order {
  id: string;
  cafeId: string;
  cafeName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  pickupTime: string;
  createdAt: string;
  isPreOrder: boolean;
  pointsEarned: number;
  qrCode: string;
  fulfillmentType: FulfillmentType;
  deliveryLocation?: DeliveryLocation;
  deliveryFee?: number;
  estimatedDeliveryAt?: string;
  driverName?: string;
  driverPhone?: string;
}

export interface PreOrderSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface TopUpOption {
  amount: number;
  bonus?: number;
  popular?: boolean;
}
