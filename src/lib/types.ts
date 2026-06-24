export type OrderStatus = "preparing" | "ready" | "completed" | "cancelled";

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
