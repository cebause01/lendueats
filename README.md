# LenduEats 🍔

A mobile-first Progressive Web App for **UiTM Lendu students** — order food from campus cafes, collect loyalty points, top up your student wallet, scan QR to pay, redeem rewards, and pre-order meals before class ends.

Built as a frontend prototype for HTT212 (Introduction to Digital Tourism), inspired by McDonald's loyalty/POS and PETRONAS Setel wallet models.

## Features

- **Campus Cafe Ordering** — Browse 8 campus premises with full menus
- **LenduEats Wallet** — Top up via FPX or Touch 'n Go (simulated)
- **QR Scan & Pay** — Contactless payment at campus merchants
- **LenduEats Rewards** — Earn points, redeem free drinks & discounts
- **Pre-order** — Schedule pickup before class ends
- **PWA** — Installable on mobile home screen

## Demo Login

| Field | Value |
|-------|-------|
| Student ID | `2025893182` |
| Password | `kampus123` |

Or tap **Use Demo Account** on the login screen.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- PWA via [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — use Chrome DevTools mobile view or your phone on the same network.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Next.js** (auto-detected)
4. Deploy — no environment variables needed

Or use the Vercel CLI:

```bash
npx vercel
```

## Install as App (PWA)

1. Open the deployed site on your phone (Chrome/Safari)
2. **Android**: Menu → "Add to Home screen" / "Install app"
3. **iOS**: Share → "Add to Home Screen"

## Project Structure

```
src/
├── app/           # Pages (home, cafes, wallet, pay, rewards, etc.)
├── components/    # UI components (shadcn + custom)
├── context/       # App state (cart, wallet, orders)
└── lib/           # Hardcoded data & utilities
```

All data is hardcoded in `src/lib/data.ts` — no backend required.
