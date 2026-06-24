import type {
  Cafe,
  MenuItem,
  Order,
  PreOrderSlot,
  Reward,
  Student,
  TopUpOption,
  Transaction,
} from "./types";
import { images } from "./images";

export const CAMPUS_NAME = "UiTM Lendu";
export const CAMPUS_FULL_NAME =
  "UiTM Cawangan Melaka Kampus Alor Gajah (Lendu)";
export const CAMPUS_ADDRESS = "KM 26, Jalan Lendu, 78000 Alor Gajah, Melaka";
export const CAMPUS_SUPPORT_PHONE = "+6065582000";
export const CAMPUS_SUPPORT_PHONE_DISPLAY = "(+606) 558 2000";
export const CAMPUS_SUPPORT_EMAIL = "pnc.inqka@uitm.edu.my";

export const APP_NAME = "KampusKafe";
export const APP_TAGLINE = `Campus Food & Convenience · ${CAMPUS_NAME}`;

export const DEMO_CREDENTIALS = {
  studentId: "2025893182",
  password: "kampus123",
};

export const student: Student = {
  id: "stu-001",
  name: "Mohammad Hadif",
  studentId: "2025893182",
  email: "hadif@student.uitm.edu.my",
  faculty: "Faculty of Hotel & Tourism Management (FHTM)",
  avatar: "MH",
  walletBalance: 48.5,
  points: 1240,
  tier: "Silver",
};

export const cafes: Cafe[] = [
  {
    id: "cafe-1",
    name: "Kafe FHTM Lendu",
    location: "KPP1, Ground Floor",
    rating: 4.6,
    reviewCount: 328,
    openHours: "7:00 AM – 6:00 PM",
    image: images.cafes["cafe-1"],
    category: "Western & Local",
    prepTime: "10–15 min",
    isOpen: true,
    tags: ["Halal", "FHTM Training Kitchen"],
  },
  {
    id: "cafe-2",
    name: "Warung Selera Lendu",
    location: "Dewan Bentara, KPP1",
    rating: 4.4,
    reviewCount: 512,
    openHours: "7:30 AM – 5:30 PM",
    image: images.cafes["cafe-2"],
    category: "Malay Cuisine",
    prepTime: "8–12 min",
    isOpen: true,
    tags: ["Halal", "Budget Friendly"],
  },
  {
    id: "cafe-3",
    name: "Bean & Brew Lendu",
    location: "Perpustakaan KPP1",
    rating: 4.8,
    reviewCount: 189,
    openHours: "8:00 AM – 8:00 PM",
    image: images.cafes["cafe-3"],
    category: "Coffee & Pastries",
    prepTime: "5–8 min",
    isOpen: true,
    tags: ["Coffee", "Study Spot"],
  },
  {
    id: "cafe-4",
    name: "Kedai Mesra Kolej Tuah",
    location: "Kolej Tuah, Ground Floor",
    rating: 4.2,
    reviewCount: 97,
    openHours: "24 Hours",
    image: images.cafes["cafe-4"],
    category: "Convenience Store",
    prepTime: "Instant",
    isOpen: true,
    tags: ["Snacks", "Top-up"],
  },
  {
    id: "cafe-5",
    name: "Sushi Corner KPP2",
    location: "KPP2, Faculty Block",
    rating: 4.5,
    reviewCount: 156,
    openHours: "10:00 AM – 4:00 PM",
    image: images.cafes["cafe-5"],
    category: "Japanese",
    prepTime: "12–18 min",
    isOpen: false,
    tags: ["Premium", "Limited Hours"],
  },
];

export const menuItems: MenuItem[] = [
  // Kafe FHTM Lendu
  {
    id: "m-1",
    cafeId: "cafe-1",
    name: "Nasi Ayam Berempah",
    description: "Fragrant rice with spiced grilled chicken & sambal",
    price: 8.5,
    image: images.menu["m-1"],
    category: "Rice",
    popular: true,
  },
  {
    id: "m-2",
    cafeId: "cafe-1",
    name: "Burger Daging Special",
    description: "Beef patty, cheese, caramelised onion & fries",
    price: 12.0,
    image: images.menu["m-2"],
    category: "Western",
    popular: true,
  },
  {
    id: "m-3",
    cafeId: "cafe-1",
    name: "Mee Goreng Mamak",
    description: "Wok-fried noodles with egg, tofu & vegetables",
    price: 7.0,
    image: images.menu["m-3"],
    category: "Noodles",
  },
  {
    id: "m-4",
    cafeId: "cafe-1",
    name: "Teh Tarik",
    description: "Classic pulled milk tea",
    price: 2.5,
    image: images.menu["m-4"],
    category: "Drinks",
    popular: true,
  },
  {
    id: "m-5",
    cafeId: "cafe-1",
    name: "Air Kosong",
    description: "Mineral water 500ml",
    price: 1.5,
    image: images.menu["m-5"],
    category: "Drinks",
  },
  // Warung Selera
  {
    id: "m-6",
    cafeId: "cafe-2",
    name: "Nasi Lemak Biasa",
    description: "Coconut rice, sambal, egg, peanuts & anchovies",
    price: 5.0,
    image: images.menu["m-6"],
    category: "Rice",
    popular: true,
  },
  {
    id: "m-7",
    cafeId: "cafe-2",
    name: "Nasi Lemak Ayam Goreng",
    description: "Nasi lemak with crispy fried chicken",
    price: 8.0,
    image: images.menu["m-7"],
    category: "Rice",
    popular: true,
  },
  {
    id: "m-8",
    cafeId: "cafe-2",
    name: "Roti Canai Kosong",
    description: "Flaky flatbread with dhal curry",
    price: 2.0,
    image: images.menu["m-8"],
    category: "Bread",
  },
  {
    id: "m-9",
    cafeId: "cafe-2",
    name: "Milo Ais",
    description: "Iced chocolate malt drink",
    price: 3.0,
    image: images.menu["m-9"],
    category: "Drinks",
  },
  // Bean & Brew Lendu
  {
    id: "m-10",
    cafeId: "cafe-3",
    name: "Latte",
    description: "Espresso with steamed milk",
    price: 9.0,
    image: images.menu["m-10"],
    category: "Coffee",
    popular: true,
  },
  {
    id: "m-11",
    cafeId: "cafe-3",
    name: "Caramel Macchiato",
    description: "Espresso, vanilla & caramel drizzle",
    price: 11.0,
    image: images.menu["m-11"],
    category: "Coffee",
    popular: true,
  },
  {
    id: "m-12",
    cafeId: "cafe-3",
    name: "Croissant Butter",
    description: "Freshly baked buttery croissant",
    price: 5.5,
    image: images.menu["m-12"],
    category: "Pastries",
    vegetarian: true,
  },
  {
    id: "m-13",
    cafeId: "cafe-3",
    name: "Blueberry Muffin",
    description: "Soft muffin with blueberry filling",
    price: 6.0,
    image: images.menu["m-13"],
    category: "Pastries",
    vegetarian: true,
  },
  // Kedai Mesra Kolej Tuah
  {
    id: "m-14",
    cafeId: "cafe-4",
    name: "Sandwich Tuna",
    description: "Ready-to-eat tuna sandwich",
    price: 4.5,
    image: images.menu["m-14"],
    category: "Snacks",
  },
  {
    id: "m-15",
    cafeId: "cafe-4",
    name: "Mineral Water 1.5L",
    description: "Bottled drinking water",
    price: 2.5,
    image: images.menu["m-15"],
    category: "Drinks",
  },
  {
    id: "m-16",
    cafeId: "cafe-4",
    name: "Potato Chips",
    description: "Assorted flavours 150g",
    price: 5.0,
    image: images.menu["m-16"],
    category: "Snacks",
  },
  // Sushi Corner KPP2
  {
    id: "m-17",
    cafeId: "cafe-5",
    name: "Salmon Maki Set",
    description: "8 pieces salmon maki with wasabi",
    price: 15.0,
    image: images.menu["m-17"],
    category: "Sushi",
    popular: true,
  },
  {
    id: "m-18",
    cafeId: "cafe-5",
    name: "Chicken Teriyaki Bento",
    description: "Rice, teriyaki chicken, salad & miso soup",
    price: 18.0,
    image: images.menu["m-18"],
    category: "Bento",
  },
];

export const rewards: Reward[] = [
  {
    id: "r-1",
    name: "Free Teh Tarik",
    description: "Redeem at any Lendu campus outlet",
    pointsCost: 150,
    type: "drink",
    image: images.rewards["r-1"],
    expiresIn: "30 days",
  },
  {
    id: "r-2",
    name: "Free Latte",
    description: "Valid at Bean & Brew Lendu only",
    pointsCost: 300,
    type: "drink",
    image: images.rewards["r-2"],
    expiresIn: "30 days",
  },
  {
    id: "r-3",
    name: "RM3 Off Next Order",
    description: "Min. spend RM10",
    pointsCost: 200,
    type: "discount",
    image: images.rewards["r-3"],
    expiresIn: "14 days",
  },
  {
    id: "r-4",
    name: "RM5 Off Next Order",
    description: "Min. spend RM20",
    pointsCost: 400,
    type: "discount",
    image: images.rewards["r-4"],
    expiresIn: "14 days",
  },
  {
    id: "r-5",
    name: "Free Nasi Lemak",
    description: "Warung Selera Lendu exclusive",
    pointsCost: 500,
    type: "meal",
    image: images.rewards["r-5"],
    expiresIn: "7 days",
  },
  {
    id: "r-6",
    name: "10% Off Total Bill",
    description: "One-time use, all Lendu outlets",
    pointsCost: 800,
    type: "discount",
    image: images.rewards["r-6"],
    expiresIn: "7 days",
  },
];

export const transactions: Transaction[] = [
  {
    id: "t-1",
    type: "payment",
    amount: -12.0,
    date: "2026-06-24T08:15:00",
    description: "Kafe FHTM Lendu – Burger Daging Special",
    pointsEarned: 24,
  },
  {
    id: "t-2",
    type: "topup",
    amount: 50.0,
    date: "2026-06-23T14:30:00",
    description: "Wallet top-up via FPX",
  },
  {
    id: "t-3",
    type: "payment",
    amount: -5.0,
    date: "2026-06-23T12:00:00",
    description: "Warung Selera – Nasi Lemak Biasa",
    pointsEarned: 10,
  },
  {
    id: "t-4",
    type: "reward",
    amount: 0,
    date: "2026-06-22T16:45:00",
    description: "Redeemed: Free Teh Tarik",
    pointsEarned: -150,
  },
  {
    id: "t-5",
    type: "payment",
    amount: -9.0,
    date: "2026-06-22T10:20:00",
    description: "Bean & Brew Lendu – Latte",
    pointsEarned: 18,
  },
  {
    id: "t-6",
    type: "topup",
    amount: 20.0,
    date: "2026-06-20T09:00:00",
    description: "Wallet top-up via Touch 'n Go",
  },
];

export const orders: Order[] = [
  {
    id: "ORD-2847",
    cafeId: "cafe-1",
    cafeName: "Kafe FHTM Lendu",
    items: [
      { name: "Burger Daging Special", quantity: 1, price: 12.0 },
      { name: "Teh Tarik", quantity: 1, price: 2.5 },
    ],
    total: 14.5,
    status: "preparing",
    pickupTime: "12:30 PM",
    createdAt: "2026-06-24T11:45:00",
    isPreOrder: true,
    pointsEarned: 29,
    qrCode: "KK-2847-FHTM",
  },
  {
    id: "ORD-2831",
    cafeId: "cafe-3",
    cafeName: "Bean & Brew Lendu",
    items: [{ name: "Latte", quantity: 1, price: 9.0 }],
    total: 9.0,
    status: "completed",
    pickupTime: "10:15 AM",
    createdAt: "2026-06-22T10:05:00",
    isPreOrder: false,
    pointsEarned: 18,
    qrCode: "KK-2831-BREW",
  },
  {
    id: "ORD-2819",
    cafeId: "cafe-2",
    cafeName: "Warung Selera Lendu",
    items: [
      { name: "Nasi Lemak Ayam Goreng", quantity: 1, price: 8.0 },
      { name: "Milo Ais", quantity: 1, price: 3.0 },
    ],
    total: 11.0,
    status: "completed",
    pickupTime: "1:00 PM",
    createdAt: "2026-06-21T12:30:00",
    isPreOrder: true,
    pointsEarned: 22,
    qrCode: "KK-2819-WSU",
  },
];

export const preOrderSlots: PreOrderSlot[] = [
  { id: "h-9", time: "9:00 AM", available: true },
  { id: "h-10", time: "10:00 AM", available: true },
  { id: "h-11", time: "11:00 AM", available: true },
  { id: "h-12", time: "12:00 PM", available: true },
  { id: "h-13", time: "1:00 PM", available: true },
  { id: "h-14", time: "2:00 PM", available: true },
  { id: "h-15", time: "3:00 PM", available: true },
  { id: "h-16", time: "4:00 PM", available: false },
  { id: "h-17", time: "5:00 PM", available: true },
  { id: "h-18", time: "6:00 PM", available: true },
];

export const topUpOptions: TopUpOption[] = [
  { amount: 10 },
  { amount: 20, popular: true },
  { amount: 50, bonus: 2 },
  { amount: 100, bonus: 5, popular: true },
];

export const paymentMethods = [
  { id: "wallet", name: "Kampus Wallet", icon: "wallet" as const },
  { id: "fpx", name: "Online Banking (FPX)", icon: "bank" as const },
  { id: "tng", name: "Touch 'n Go eWallet", icon: "smartphone" as const },
];

export const promoBanners = [
  {
    id: "p-1",
    title: "Double Points Week!",
    subtitle: "Earn 2× Kampus Points on all orders",
    href: "/rewards",
    image: images.promos["p-1"],
    color: "from-uitm-navy/90 to-uitm-magenta/90",
  },
  {
    id: "p-2",
    title: "Pre-order & Skip the Queue",
    subtitle: "Order before class ends, pick up at KPP",
    href: "/pre-order",
    image: images.promos["p-2"],
    color: "from-uitm-magenta/90 to-uitm-navy/90",
  },
];

export const tierBenefits = {
  Bronze: { multiplier: 1, nextTier: "Silver", pointsNeeded: 500 },
  Silver: { multiplier: 1.5, nextTier: "Gold", pointsNeeded: 2000 },
  Gold: { multiplier: 2, nextTier: null, pointsNeeded: 0 },
};

export const tierDetails = [
  {
    tier: "Bronze" as const,
    minPoints: 0,
    multiplier: 1,
    perks: ["2 points per RM1 spent", "Access to basic rewards"],
  },
  {
    tier: "Silver" as const,
    minPoints: 500,
    multiplier: 1.5,
    perks: ["1.5× points on every order", "Birthday free drink", "Promo early access"],
  },
  {
    tier: "Gold" as const,
    minPoints: 2000,
    multiplier: 2,
    perks: ["2× points on every order", "Priority pickup queue", "Exclusive Gold rewards"],
  },
];

export function formatCurrency(amount: number): string {
  return `RM ${Math.abs(amount).toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getCafeById(id: string): Cafe | undefined {
  return cafes.find((c) => c.id === id);
}

export function getMenuByCafe(cafeId: string): MenuItem[] {
  return menuItems.filter((m) => m.cafeId === cafeId);
}
