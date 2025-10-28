# Glomia Life (glomia.life)

Next 15 + React 19 + TypeScript (App Router + RSC) monorepo for Glomia Life. Includes mock APIs, i18n, web3 wallet (wagmi + RainbowKit), Tailwind UI, and basic pages.

## Stack

- Framework: `next@^15`, `react@^19`, `react-dom@^19`
- Styling: `tailwindcss@^3`, `clsx`, `class-variance-authority`, `lucide-react`
- i18n: `next-intl@^3`
- Data: `@tanstack/react-query@^5`, `zustand@^4`
- Forms: `react-hook-form@^7`, `zod@^3`
- Web3: `wagmi@^2`, `viem@^2`, `@rainbow-me/rainbowkit@^2`
- Viz: `recharts@^2` (client-only via dynamic import)
- Quality: `eslint-config-next`, `@typescript-eslint/*`, `prettier`, `husky`, `lint-staged`, `@commitlint/*`

## Getting Started

1. Install deps

- pnpm i

2. Prepare environment

- Copy `.env.example` to `.env.local` and set:
  - `NEXT_PUBLIC_SITE_URL=http://localhost:3000` (required for RSC fetch to API)
  - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=xxxxxxx` (get from WalletConnect)

3. Seed local mock data (optional; repo already includes data)

- pnpm seed

4. Run dev server

- pnpm dev

Visit `/zh` or `/en`.

## Features

- Mock API (file-based): `/app/api/_data/*.json` with REST routes:
  - GET `/api/bases?filter=...` → `BaseSummary[]`
  - GET `/api/bases?slug=...` → `BaseDetail`
  - GET `/api/nodes?baseId=...` → `NodeItem[]`
- GET `/api/nodes?id=...` → `NodeItem`
 - GET `/api/availability?nodeId=...&at=ISO` → `{seats, occupied, available, load}`
 - GET `/api/reviews?nodeId=...|baseId=...` → `Review[]`
 - POST `/api/reviews` → create a review `{ nodeId|baseId, author, rating, content }`
 - GET `/api/bookings?nodeId=...|baseId=...` → `Booking[]`
 - POST `/api/bookings` → create a booking `{ type, start, end, includeHousing?, includeCowork? }`
 - GET `/api/guides?baseId=...` → posts tagged with base slug
 - GET `/api/essentials?baseId=...` → `{ visa, insurance, tax, medical }`
 - GET `/api/recommend?skills=a,b&interests=x,y&baseId=...` → recommended nodes
  - GET `/api/community` and `/api/community?id=...` → `Post[] | Post`
  - GET/POST `/api/activities` → `Activity[]` | create
- Server Actions preferred for creating activity: see `lib/actions.ts#createActivityAction`
  - Fallback client: `services/activities.ts#createActivity` → POST `/api/activities`
- Wallet connection via wagmi + RainbowKit. See `components/layout/WalletButton.tsx` and `hooks/useWallet.ts`.
- i18n with `next-intl` and locale-prefixed routes via `middleware.ts`.
- Tailwind styling with soft cards and responsive grid; dynamic `recharts` for metric placeholder.

## Directory Structure

See request; notable paths:

- `app/[locale]/*`: pages
- `app/api/*`: mock API routes
- `components/*`: layout, cards, shared, forms
- `services/*`: API clients with retry/timeout
- `stores/*`: Zustand stores for UI and draft
- `types/*`: shared TS types

## Replacing Mock with Real Backends

- Swap `services/*` implementations to call your real endpoints; keep the same return shapes for UI continuity.
- For Server Actions, replace file writes in `lib/actions.ts` with DB/service calls, then `revalidatePath` as needed.
- Migrate `/api/*` routes to proxy real services or remove them once clients point to real backends.

## Web3 Integration Notes

- Replace `signMessageAction` with a real on-chain flow (client signs with wagmi `useSignMessage`; server verifies signature and proceeds).
- Gating: Buttons for signup/post/create check `useWallet().isConnected` before proceeding.

## Scripts

- `pnpm dev` – Start dev server
- `pnpm build` – Build
- `pnpm start` – Start prod
- `pnpm lint` – Lint
- `pnpm format` – Prettier format
- `pnpm seed` – Seed mock data if missing

## Git Hooks & Commit Conventions

- Husky + lint-staged: Pre-commit runs ESLint/Prettier.
- Commitlint with Conventional Commits (feat/fix/docs/refactor/chore/test/build).

## Notes

- Some UI controls are minimal native elements for maximum compatibility with React 19/RSC; you can swap to shadcn/Radix components progressively.
- Client-only libs (RainbowKit, recharts) are isolated in client components or `dynamic(() => import(...), { ssr: false })`.
