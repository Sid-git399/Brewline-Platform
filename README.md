# Brewline

A full-stack e-commerce demo for specialty coffee gear — whole bean coffee, pour-over
brewers, grinders, and accessories.

## Architecture overview

Built on Next.js 14's App Router, using Server Components for data reads and API routes
only for mutations that need server-side validation:

- **Reads** (product listing, product detail, order history) are Server Components that
  query Prisma directly — no unnecessary REST layer for data that's only ever read.
- **Writes** (`/api/register`, `/api/checkout`) are dedicated API routes. Every write is
  validated with Zod on the server; nothing from the client is trusted for pricing,
  stock, or authorization.
- **Auth** is NextAuth with a Credentials provider, JWT sessions, and bcrypt password
  hashing. `src/middleware.ts` blocks `/checkout` and `/orders` server-side for
  unauthenticated requests — access control isn't just a hidden button.
- **Checkout security**: the client only ever sends `{ productId, quantity }` pairs.
  `/api/checkout` looks up current prices and stock from the database, recomputes the
  total itself, and rejects the order if stock is insufficient. Order history is always
  filtered by the authenticated user's id, so no user can view another user's orders.
- **Cart** is client-side state (`src/context/CartContext.tsx`), persisted to
  `localStorage`. It's convenience state, not a source of truth — the server never
  trusts it for prices.

```
brewline/
├── prisma/
│   ├── schema.prisma       # User, Product, Order, OrderItem models
│   └── seed.ts             # Demo product catalog
├── src/
│   ├── middleware.ts       # Route protection for /checkout and /orders
│   ├── lib/
│   │   ├── prisma.ts       # Prisma client singleton
│   │   ├── auth.ts         # NextAuth configuration
│   │   ├── password.ts     # bcrypt hashing helpers
│   │   ├── validations.ts  # Zod schemas for API input
│   │   └── format.ts       # Currency formatting
│   ├── context/
│   │   └── CartContext.tsx # Client-side cart state
│   ├── components/         # Header, Footer, ProductCard, AddToCartForm, Providers
│   └── app/
│       ├── page.tsx                 # Home
│       ├── shop/page.tsx            # Product listing + category filter
│       ├── products/[slug]/page.tsx # Product detail
│       ├── cart/page.tsx            # Cart
│       ├── checkout/page.tsx        # Checkout form (protected)
│       ├── orders/page.tsx          # Order history (protected)
│       ├── login/page.tsx
│       ├── register/page.tsx
│       └── api/
│           ├── auth/[...nextauth]/route.ts
│           ├── register/route.ts
│           └── checkout/route.ts
└── docs/
    └── COMMIT_PLAN.md
```

## Prerequisites

- Node.js 18.18 or later
- npm

## Installation

```bash
npm install
cp .env.example .env
```

Generate a real `NEXTAUTH_SECRET` and put it in `.env`:

```bash
openssl rand -base64 32
```

Set up the database (SQLite file, created automatically):

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

## Development

```bash
npm run dev
```

Visit http://localhost:3000. Register an account to place an order — orders and
checkout require authentication.

## Build

```bash
npm run build
npm run start
```

## Moving to production

- **Database**: switch `provider = "sqlite"` to `provider = "postgresql"` in
  `prisma/schema.prisma`, point `DATABASE_URL` at a real Postgres instance (Neon,
  Supabase, Railway, etc.), then re-run `npx prisma migrate dev`.
- **Payments**: checkout currently just records an order — no real payment is
  processed. Integrating a real processor (e.g. Stripe) means creating a
  PaymentIntent in `/api/checkout` and confirming it client-side before marking the
  order paid.
- **Images**: product images use `picsum.photos` placeholders (seeded by `imageSeed`
  in the schema) — swap for real product photography and consider `next/image` with
  a configured remote pattern.

See `docs/COMMIT_PLAN.md` for a suggested day-by-day breakdown if you're pushing this
incrementally.
