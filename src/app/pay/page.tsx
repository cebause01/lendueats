"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { QrCode, ScanLine, Store, CheckCircle2, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { AppImage } from "@/components/ui/app-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/context/app-context";
import { formatCurrency } from "@/lib/data";
import { images } from "@/lib/images";
import { merchantQrPayload, parseMerchantQr } from "@/lib/qr-pay";
import { cn } from "@/lib/utils";

const QrScanner = dynamic(
  () => import("@/components/pay/qr-scanner").then((m) => m.QrScanner),
  { ssr: false, loading: () => (
    <div className="flex size-full items-center justify-center bg-black text-sm text-white/70">
      Starting camera...
    </div>
  )}
);

const merchants = [
  {
    id: "m-1",
    name: "Cafe Bentara",
    amount: 8.0,
    image: images.merchants["m-1"],
  },
  {
    id: "m-2",
    name: "Pakya Sinar",
    amount: 7.0,
    image: images.merchants["m-2"],
  },
  {
    id: "m-3",
    name: "Cafe Richiamo",
    amount: 9.0,
    image: images.merchants["m-3"],
  },
] as const;

type Merchant = (typeof merchants)[number];

export default function PayPage() {
  const { student, payWithQR } = useApp();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant>(merchants[0]);
  const [paid, setPaid] = useState(false);
  const [showDemoQr, setShowDemoQr] = useState<string | null>(null);

  const selectMerchant = useCallback((merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setScanned(true);
    setPaid(false);
    setScanning(false);
  }, []);

  const handleQrDecoded = useCallback(
    (text: string) => {
      setScanning(false);
      const merchantId = parseMerchantQr(text);
      const merchant = merchants.find((m) => m.id === merchantId);

      if (!merchant) {
        toast.error("Invalid QR code. Scan a LenduEats merchant code.");
        return;
      }

      selectMerchant(merchant);
      toast.success(`Scanned ${merchant.name}`);
    },
    [selectMerchant]
  );

  const handleCameraError = useCallback((message: string) => {
    setScanning(false);
    toast.error(message);
  }, []);

  const startScan = () => {
    setScanning(true);
    setScanned(false);
    setPaid(false);
    setShowDemoQr(null);
  };

  const stopScan = () => {
    setScanning(false);
  };

  const handlePay = () => {
    if (payWithQR(selectedMerchant.amount, selectedMerchant.name)) {
      setPaid(true);
      setScanning(false);
    }
  };

  const resetFlow = () => {
    setScanned(false);
    setPaid(false);
    setScanning(false);
    setShowDemoQr(null);
  };

  return (
    <MobileShell>
      <PageHeader title="Scan & Pay" subtitle="Pay with your LenduEats Wallet" />

      <div className="px-4 pb-4">
        <Card className="border-border/60 bg-uitm-navy-tint">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Wallet Balance</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(student.walletBalance)}
            </p>
          </CardContent>
        </Card>

        <div className="relative mx-auto mt-6 aspect-square w-full max-w-[300px] overflow-hidden rounded-3xl border-2 border-primary/20 bg-black shadow-lg">
          {scanning ? (
            <>
              <QrScanner
                active={scanning}
                onScan={handleQrDecoded}
                onCameraError={handleCameraError}
              />
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-4 left-4 size-10 rounded-tl-xl border-t-2 border-l-2 border-white" />
                <div className="absolute top-4 right-4 size-10 rounded-tr-xl border-t-2 border-r-2 border-white" />
                <div className="absolute bottom-4 left-4 size-10 rounded-bl-xl border-b-2 border-l-2 border-white" />
                <div className="absolute bottom-4 right-4 size-10 rounded-br-xl border-b-2 border-r-2 border-white" />
                <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-white/90">
                  Align QR code within the frame
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="absolute top-3 right-3 z-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={stopScan}
                aria-label="Close camera"
              >
                <X className="size-4" />
              </Button>
            </>
          ) : paid ? (
            <div className="flex size-full flex-col items-center justify-center bg-white p-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="size-10" />
              </div>
              <p className="mt-4 font-semibold text-green-600">Payment Successful!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Paid {formatCurrency(selectedMerchant.amount)}
              </p>
            </div>
          ) : scanned ? (
            <div className="flex size-full flex-col items-center justify-center bg-white p-4">
              <div className="relative size-20 overflow-hidden rounded-2xl shadow-md">
                <AppImage
                  src={selectedMerchant.image}
                  alt={selectedMerchant.name}
                  fill
                />
              </div>
              <p className="mt-4 font-medium">{selectedMerchant.name}</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(selectedMerchant.amount)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Confirm payment below</p>
            </div>
          ) : (
            <div className="flex size-full flex-col items-center justify-center bg-uitm-navy-tint p-4">
              <QrCode className="size-16 text-primary/30" />
              <p className="mt-4 px-2 text-center text-sm text-muted-foreground">
                Tap below to open your camera and scan a merchant QR code
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {!scanning && !scanned && !paid && (
            <Button className="h-12 w-full gap-2" onClick={startScan}>
              <ScanLine className="size-5" />
              Open Camera & Scan
            </Button>
          )}

          {scanning && (
            <Button variant="outline" className="h-12 w-full" onClick={stopScan}>
              Cancel Scan
            </Button>
          )}

          {scanned && !paid && (
            <>
              <Button className="h-12 w-full" onClick={handlePay}>
                Pay {formatCurrency(selectedMerchant.amount)}
              </Button>
              <Button variant="outline" className="w-full" onClick={resetFlow}>
                Scan Again
              </Button>
            </>
          )}

          {paid && (
            <Button variant="outline" className="w-full" onClick={resetFlow}>
              New Payment
            </Button>
          )}
        </div>

        <section className="mt-8">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Store className="size-4" />
            Demo merchants — tap to show QR or select
          </p>
          <div className="space-y-2">
            {merchants.map((m) => (
              <div key={m.id} className="rounded-xl border border-border/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => selectMerchant(m)}
                  className={cn(
                    "flex w-full items-center gap-3 p-3 transition-colors active:scale-[0.99]",
                    selectedMerchant.id === m.id && scanned
                      ? "bg-primary/5"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                    <AppImage src={m.image} alt={m.name} fill />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(m.amount)}
                    </p>
                  </div>
                </button>
                <div className="border-t border-border/60 bg-muted/30 px-3 py-2">
                  <button
                    type="button"
                    className="text-xs font-medium text-primary"
                    onClick={() =>
                      setShowDemoQr(showDemoQr === m.id ? null : m.id)
                    }
                  >
                    {showDemoQr === m.id ? "Hide" : "Show"} scan QR code
                  </button>
                  {showDemoQr === m.id && (
                    <div className="mt-3 flex flex-col items-center gap-2 pb-2">
                      <div className="rounded-xl bg-white p-3 shadow-sm">
                        <QRCodeSVG
                          value={merchantQrPayload(m.id)}
                          size={160}
                          level="M"
                          includeMargin
                        />
                      </div>
                      <p className="text-center text-[10px] text-muted-foreground">
                        Scan this code with the camera above, or display it on
                        another screen
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
