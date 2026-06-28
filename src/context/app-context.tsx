"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { student as initialStudent, getCafeById } from "@/lib/data";
import {
  DELIVERY_FEE,
  computeEstimatedDeliveryAt,
  deliveryStageToStatus,
  getDeliveryLocation,
  getDriverForOrder,
  getSimulatedDeliveryStage,
} from "@/lib/delivery";
import type {
  CartItem,
  FulfillmentType,
  Order,
  Reward,
  Student,
  Transaction,
} from "@/lib/types";

interface AppContextValue {
  isAuthenticated: boolean;
  login: (studentId: string, password: string) => boolean;
  logout: () => void;
  student: Student;
  cart: CartItem[];
  activeCafeId: string | null;
  orders: Order[];
  transactions: Transaction[];
  redeemedRewards: string[];
  activeDiscount: { id: string; amount: number } | null;
  fulfillmentMode: FulfillmentType;
  setFulfillmentMode: (mode: FulfillmentType) => void;
  setActiveCafeId: (id: string | null) => void;
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (menuItemId: string, quantity: number) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  topUpWallet: (amount: number, method: string) => void;
  placeOrder: (options: {
    isPreOrder: boolean;
    pickupTime: string;
    paymentMethod: string;
    fulfillmentType: FulfillmentType;
    deliveryLocationId?: string;
  }) => Order | null;
  getOrderById: (id: string) => Order | undefined;
  redeemReward: (reward: Reward) => boolean;
  payWithQR: (amount: number, merchant: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentData, setStudentData] = useState<Student>(initialStudent);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCafeId, setActiveCafeId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);
  const [activeDiscount, setActiveDiscount] = useState<{
    id: string;
    amount: number;
  } | null>(null);
  const [fulfillmentMode, setFulfillmentMode] =
    useState<FulfillmentType>("pickup");

  const login = useCallback((studentId: string, password: string) => {
    if (studentId === "2025893182" && password === "kampus123") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCart([]);
    setActiveCafeId(null);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === item.menuItem.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    toast.success(`Added ${item.menuItem.name}`);
  }, []);

  const updateCartQuantity = useCallback(
    (menuItemId: string, quantity: number) => {
      if (quantity <= 0) {
        setCart((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
        return;
      }
      setCart((prev) =>
        prev.map((i) =>
          i.menuItem.id === menuItemId ? { ...i, quantity } : i
        )
      );
    },
    []
  );

  const removeFromCart = useCallback((menuItemId: string) => {
    setCart((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
    [cart]
  );

  const cartItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const topUpWallet = useCallback((amount: number, method: string) => {
    setStudentData((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    const tx: Transaction = {
      id: `t-${Date.now()}`,
      type: "topup",
      amount,
      date: new Date().toISOString(),
      description: `Wallet top-up via ${method}`,
    };
    setTransactions((prev) => [tx, ...prev]);
    toast.success(`Topped up RM ${amount.toFixed(2)}`);
  }, []);

  const placeOrder = useCallback(
    (options: {
      isPreOrder: boolean;
      pickupTime: string;
      paymentMethod: string;
      fulfillmentType: FulfillmentType;
      deliveryLocationId?: string;
    }): Order | null => {
      if (cart.length === 0 || !activeCafeId) return null;

      if (options.fulfillmentType === "delivery" && !options.deliveryLocationId) {
        toast.error("Please select a delivery location");
        return null;
      }

      const deliveryLocation =
        options.deliveryLocationId != null
          ? getDeliveryLocation(options.deliveryLocationId)
          : undefined;

      const deliveryFee =
        options.fulfillmentType === "delivery" ? DELIVERY_FEE : 0;

      let total = cartTotal + deliveryFee;
      if (activeDiscount) {
        total = Math.max(0, total - activeDiscount.amount);
      }

      if (options.paymentMethod === "wallet" && studentData.walletBalance < total) {
        toast.error("Insufficient wallet balance");
        return null;
      }

      const cafe = getCafeById(activeCafeId);
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const pointsEarned = Math.floor(total * 2);
      const createdAt = new Date().toISOString();
      const driver = getDriverForOrder(orderId);

      const order: Order = {
        id: orderId,
        cafeId: activeCafeId,
        cafeName: cafe?.name ?? "Campus Cafe",
        items: cart.map((i) => ({
          name: i.menuItem.name,
          quantity: i.quantity,
          price: i.menuItem.price,
        })),
        total,
        status:
          options.fulfillmentType === "delivery" ? "confirmed" : "preparing",
        pickupTime: options.pickupTime,
        createdAt,
        isPreOrder: options.isPreOrder,
        pointsEarned,
        qrCode: `KK-${orderId.split("-")[1]}`,
        fulfillmentType: options.fulfillmentType,
        deliveryLocation,
        deliveryFee: deliveryFee || undefined,
        estimatedDeliveryAt:
          options.fulfillmentType === "delivery" && options.deliveryLocationId
            ? computeEstimatedDeliveryAt(createdAt, options.deliveryLocationId)
            : undefined,
        driverName: options.fulfillmentType === "delivery" ? driver.name : undefined,
        driverPhone:
          options.fulfillmentType === "delivery" ? driver.phone : undefined,
      };

      if (options.paymentMethod === "wallet") {
        setStudentData((prev) => ({
          ...prev,
          walletBalance: prev.walletBalance - total,
          points: prev.points + pointsEarned,
        }));
      } else {
        setStudentData((prev) => ({
          ...prev,
          points: prev.points + pointsEarned,
        }));
      }

      const tx: Transaction = {
        id: `t-${Date.now()}`,
        type: "payment",
        amount: -total,
        date: new Date().toISOString(),
        description: `Order ${orderId}${
          options.fulfillmentType === "delivery" ? " (Delivery)" : ""
        }`,
        pointsEarned,
      };
      setTransactions((prev) => [tx, ...prev]);
      setOrders((prev) => [order, ...prev]);
      clearCart();
      if (activeDiscount) setActiveDiscount(null);
      toast.success(
        options.fulfillmentType === "delivery"
          ? "Delivery order placed! Track your rider live."
          : "Order placed successfully!"
      );
      return order;
    },
    [
      cart,
      activeCafeId,
      cartTotal,
      activeDiscount,
      studentData.walletBalance,
      clearCart,
    ]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.fulfillmentType !== "delivery") return order;
          const stage = getSimulatedDeliveryStage(order.createdAt);
          const status = deliveryStageToStatus(stage);
          if (order.status === status) return order;
          return { ...order, status };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getOrderById = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  const redeemReward = useCallback(
    (reward: Reward): boolean => {
      if (studentData.points < reward.pointsCost) {
        toast.error("Not enough points");
        return false;
      }
      if (redeemedRewards.includes(reward.id)) {
        toast.error("Reward already redeemed");
        return false;
      }

      setStudentData((prev) => ({
        ...prev,
        points: prev.points - reward.pointsCost,
      }));
      setRedeemedRewards((prev) => [...prev, reward.id]);

      if (reward.type === "discount") {
        const amount = reward.name.includes("10%") ? 0 : reward.name.includes("RM5") ? 5 : 3;
        setActiveDiscount({
          id: reward.id,
          amount: reward.name.includes("10%") ? 0 : amount,
        });
      }

      const tx: Transaction = {
        id: `t-${Date.now()}`,
        type: "reward",
        amount: 0,
        date: new Date().toISOString(),
        description: `Redeemed: ${reward.name}`,
        pointsEarned: -reward.pointsCost,
      };
      setTransactions((prev) => [tx, ...prev]);
      toast.success(`Redeemed: ${reward.name}`);
      return true;
    },
    [studentData.points, redeemedRewards]
  );

  const payWithQR = useCallback(
    (amount: number, merchant: string): boolean => {
      if (studentData.walletBalance < amount) {
        toast.error("Insufficient wallet balance");
        return false;
      }
      const pointsEarned = Math.floor(amount * 2);
      setStudentData((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance - amount,
        points: prev.points + pointsEarned,
      }));
      const tx: Transaction = {
        id: `t-${Date.now()}`,
        type: "payment",
        amount: -amount,
        date: new Date().toISOString(),
        description: `QR Pay – ${merchant}`,
        pointsEarned,
      };
      setTransactions((prev) => [tx, ...prev]);
      toast.success(`Paid ${merchant} – RM ${amount.toFixed(2)}`);
      return true;
    },
    [studentData.walletBalance]
  );

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      student: studentData,
      cart,
      activeCafeId,
      orders,
      transactions,
      redeemedRewards,
      activeDiscount,
      fulfillmentMode,
      setFulfillmentMode,
      setActiveCafeId,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartItemCount,
      topUpWallet,
      placeOrder,
      getOrderById,
      redeemReward,
      payWithQR,
    }),
    [
      isAuthenticated,
      login,
      logout,
      studentData,
      cart,
      activeCafeId,
      orders,
      transactions,
      redeemedRewards,
      activeDiscount,
      fulfillmentMode,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartItemCount,
      topUpWallet,
      placeOrder,
      getOrderById,
      redeemReward,
      payWithQR,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
