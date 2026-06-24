"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, History } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";
import {
  formatCurrency,
  formatDate,
  formatTime,
  paymentMethods,
  topUpOptions,
  transactions as seedTransactions,
} from "@/lib/data";
import { PaymentMethodIcon } from "@/components/wallet/payment-method-icon";
import { cn } from "@/lib/utils";

export default function WalletPage() {
  const { student, topUpWallet, transactions } = useApp();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(20);
  const [paymentMethod, setPaymentMethod] = useState("fpx");
  const [dialogOpen, setDialogOpen] = useState(false);

  const allTransactions = [...transactions, ...seedTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleTopUp = () => {
    if (!selectedAmount) return;
    const method =
      paymentMethods.find((m) => m.id === paymentMethod)?.name ?? "FPX";
    topUpWallet(selectedAmount, method);
    setDialogOpen(false);
  };

  return (
    <MobileShell>
      <PageHeader title="LenduEats Wallet" subtitle="Top up & manage balance" showBack />

      <div className="px-4">
        <Card className="overflow-hidden border-0 bg-uitm-brand text-white shadow-lg shadow-uitm-navy/15">
          <CardContent className="p-6 text-center">
            <p className="text-sm opacity-80">Available Balance</p>
            <p className="mt-2 text-4xl font-bold">
              {formatCurrency(student.walletBalance)}
            </p>
            <Button
              className="mt-5 bg-white text-uitm-magenta hover:bg-white/90"
              onClick={() => setDialogOpen(true)}
            >
              Top Up Wallet
            </Button>
          </CardContent>
        </Card>

        <section className="mt-6">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <History className="size-4" />
            Transaction History
          </h2>
          <div className="space-y-2">
            {allTransactions.map((tx) => (
              <Card key={tx.id}>
                <CardContent className="flex items-center gap-3 p-3">
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full",
                      tx.type === "topup"
                        ? "bg-green-100 text-green-600"
                        : tx.type === "reward"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {tx.amount > 0 ? (
                      <ArrowDownLeft className="size-4" />
                    ) : (
                      <ArrowUpRight className="size-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(tx.date)} · {formatTime(tx.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        tx.amount > 0 ? "text-green-600" : "text-foreground"
                      )}
                    >
                      {tx.amount > 0 ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                    {tx.pointsEarned && tx.pointsEarned !== 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        {tx.pointsEarned > 0 ? "+" : ""}
                        {tx.pointsEarned} pts
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Top Up Wallet</DialogTitle>
            <DialogDescription>
              Select amount and payment method
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-2">
            {topUpOptions.map((opt) => (
              <button
                key={opt.amount}
                type="button"
                onClick={() => setSelectedAmount(opt.amount)}
                className={cn(
                  "relative rounded-xl border-2 p-4 text-center transition-colors",
                  selectedAmount === opt.amount
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                {opt.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                    Popular
                  </span>
                )}
                <p className="text-lg font-bold">RM {opt.amount}</p>
                {opt.bonus && (
                  <p className="text-[10px] text-green-600">+RM {opt.bonus} bonus</p>
                )}
              </button>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            {paymentMethods
              .filter((m) => m.id !== "wallet")
              .map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5",
                    paymentMethod === method.id && "border-primary bg-primary/5"
                  )}
                >
                  <PaymentMethodIcon icon={method.icon} />
                  <span className="text-sm">{method.name}</span>
                </button>
              ))}
          </div>

          <DialogFooter>
            <Button className="w-full" onClick={handleTopUp} disabled={!selectedAmount}>
              Top Up {selectedAmount ? formatCurrency(selectedAmount) : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileShell>
  );
}
