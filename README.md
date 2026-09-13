# Peboli — Local Shelf (Gauteng/SA)

**Brand promise: "Best deals. Zero hassle."**

Peboli is configured for **Local Shelf** — honest Gauteng/SA local-goods resale at **30–40% markup** (default **35%**). This is **not** an AliExpress multi-vendor dropship marketplace.

- **Public site:** sell price only (no cost/markup visible)
- **Checkout:** buy-after-pay via **Bank EFT** or **WhatsApp** (no live card gateway in P0)
- **Admin:** cost + markup pricing, real order queue, SAMPLE Gauteng placeholders

## Tech stack

- Next.js 16 (App Router) + TypeScript
- PostgreSQL + Prisma
- NextAuth (credentials + optional Google/Facebook)
- Tailwind CSS v4 + shadcn/ui
- Zustand (cart)

## Run locally (MacBook / dev)

### 1. Install

```bash
npm install
```

### 2. Environment variables

Create `.env.local` with these **key names** (never commit real values):

| Key | Purpose |
|-----|---------|
| `DATABASE_URL` | PostgreSQL connection string (local Docker, Neon, Supabase, etc.) |
| `NEXTAUTH_URL` | e.g. `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Random secret — required in production |
| `ADMIN_EMAIL` | Admin login email (default `admin@peboli.store`) |
| `LOCAL_SHELF_MODE` | `true` (default) — Local Shelf behaviour |
| `ENABLE_IMPORT_PRODUCT` | `false` (default in Local Shelf) — blocks URL scraping |
| `ENABLE_LIQUOR` | `false` (default) — liquor collection off until licensed |
| `PEBOLI_WHATSAPP_NUMBER` | WhatsApp number for pay-after-order (digits, e.g. `27821234567`) |
| `PEBOLI_EFT_BANK_NAME` | Bank name shown on checkout confirmation |
| `PEBOLI_EFT_ACCOUNT_NAME` | Account holder name |
| `PEBOLI_EFT_ACCOUNT_NUMBER` | Account number |
| `PEBOLI_EFT_BRANCH_CODE` | Optional branch code |
| `PEBOLI_EFT_REFERENCE_PREFIX` | Reference prefix (default `PEB`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional OAuth |
| `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` | Optional OAuth |
| `BLOB_READ_WRITE_TOKEN` | Optional — Vercel Blob for image uploads |

### 3. Database setup (separate from build)

```bash
npm run db:push    # sync schema — run manually, NOT during build
npm run db:seed    # SAMPLE Gauteng-local products + collections
npm run create-admin -- admin@peboli.store 'YourSecurePassword8+'
```

Or one step: `npm run db:setup`

**Local PostgreSQL (Docker example):**

```bash
docker run --name peboli-pg -e POSTGRES_PASSWORD=peboli -e POSTGRES_DB=peboli -p 5432:5432 -d postgres:16
# DATABASE_URL=postgresql://postgres:peboli@localhost:5432/peboli
```

### 4. Dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## AI Reseller Studio

Programme for Local Shelf operators to **make money with AI marketing**:

- Open **[/ai-reseller](/ai-reseller)** (public) or **Admin → AI Reseller Studio**
- Enter product + landed cost → get 30–40% sell price, listing copy, WhatsApp/social posts, deal banners
- **Sell packages** tab: Starter / Growth / Agency marketing packs you can resell to nearby shops
- Optional `OPENAI_API_KEY` for LLM copy; otherwise the built-in Peboli engine generates full packs
- API: `POST /api/ai-marketing/generate`

## Local Shelf pricing

| Field | Who sees it | Notes |
|-------|-------------|-------|
| `cost` / `landedCost` | Admin only | Your purchase/landed cost |
| `markupPercent` | Admin only | Clamped **30–40%**, default **35%** |
| `price` | Public | Auto: `round(baseCost × (1 + markup/100))` |

Add products in **Admin → Catalog** with cost + markup, or push via `/api/admin/push-product`.

## Sample vs real catalogue

- **`npm run db:seed`** creates **SAMPLE** Gauteng products (names prefixed `SAMPLE —`). Replace with real stock before going live.
- **No China/import smartwatch defaults** — import-product scraping is **disabled** unless `ENABLE_IMPORT_PRODUCT=true`.
- **No offline `live-products.json` fallback** — orders and products require a real database.

## Checkout & payments (P0)

1. Customer adds products to cart → checkout
2. Order is **persisted** in PostgreSQL (`PEB-…` order numbers)
3. Confirmation shows **EFT details** + optional **WhatsApp** link
4. Admin sees orders at `/admin/orders`

**Stubs (not live in P0):** Yoco, iKhokha, PayFast, Ozow card/Instant EFT — configuration UI may exist but no charge flow. Use EFT/WhatsApp handoff.

## Auth

- Passwords hashed with **Node scrypt** (legacy SHA-256 hashes migrate on login; re-run `create-admin` if you had a short-lived bcrypt build)
- **No mock-login fallback** when DB is down or user missing
- Create admin: `npm run create-admin -- <email> <password>`

## Build & deploy

```bash
npm run build   # prisma generate + next build only — safe, no db push
```

Run `npm run db:push` separately on each environment after deploy.

**Vercel / Render:** build does **not** run `prisma db push`. Apply schema manually post-deploy.

## Verify checklist (P0 PR)

- [ ] `npm run db:setup` — schema + SAMPLE products
- [ ] `npm run create-admin` — admin can log in (no mock user)
- [ ] Add product with cost R100 → sell price R135 at 35% markup
- [ ] Public product page shows sell price only
- [ ] Checkout from cart → real `PEB-…` order → appears in `/admin/orders`
- [ ] EFT reference + WhatsApp link on confirmation
- [ ] `/api/import-product` returns 403 in Local Shelf mode
- [ ] `/liquor` redirects home when `ENABLE_LIQUOR` unset
- [ ] `npm run build` succeeds without database

## License

Private project — iCreativate / Peboli. All rights reserved.
