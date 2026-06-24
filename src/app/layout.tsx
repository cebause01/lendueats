import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/context/app-context";
import { AuthGuard } from "@/components/layout/auth-guard";
import { APP_NAME, APP_TAGLINE, CAMPUS_NAME } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} – ${APP_TAGLINE}`,
  description:
    `Order food from ${CAMPUS_NAME} outlets, earn rewards, top up your student wallet, and pay with QR on campus.`,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#001E99",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-uitm-brand-subtle font-sans antialiased">
        <AppProvider>
          <AuthGuard>{children}</AuthGuard>
          <Toaster position="top-center" richColors closeButton />
        </AppProvider>
      </body>
    </html>
  );
}
