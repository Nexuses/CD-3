# CouponChrome

Coupon & deal directory inspired by CouponDunia’s layout, styled with a Nintendo.com ~2001 chrome design system. Phase 1: public browse + admin CRUD (no user cashback/wallet).

## Quick start

```bash
npm install
# Copy .env.example → .env and set MONGODB_URI + AUTH_SECRET
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin demo credentials

| Field    | Value       |
|----------|-------------|
| URL      | `/admin/login` |
| Username | `admin`     |
| Password | `admin123`  |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run db:seed` | Re-seed demo merchants, categories, offers |
| `npm run db:reset` | Clear and re-seed MongoDB |

## What’s included

- **Public:** Home, `/stores` (A–Z), `/category/[slug]`, `/[merchant-slug]`, offer reveal modal, click counter
- **Admin:** Login (cookie session), dashboard stats, CRUD for stores / categories / offers
- **Stack:** Next.js 15, MongoDB Atlas (Mongoose), Tailwind CSS v4
- **Design:** Coinbase-inspired institutional UI — white canvas, Coinbase Blue CTAs, dark heroes (`design.md`)

## Deploy to Vercel

1. Push this repo to GitHub (do **not** commit `.env` or `node_modules`).
2. Import the repo on [vercel.com](https://vercel.com).
3. **Important:** In Vercel → **Settings → General → Root Directory**, leave it **empty** (do not set `new CD`). The app lives at the repo root.
4. Open **Settings → Environment Variables** and add:

   | Name | Value |
   |------|--------|
   | `MONGODB_URI` | MongoDB Atlas connection string (include database name, e.g. `/couponchrome`) |
   | `AUTH_SECRET` | Any long random string |

   Enable **Production** (and **Preview** if you use preview deploys).

5. **Redeploy** after saving env vars (Deployments → ⋯ → Redeploy).

Seed the database once locally (or from CI) before going live:

```bash
npm run db:seed
```

See [`.env.example`](.env.example) for the variable names.

## Notes

- Demo logos are inline SVG data URIs.
- Affiliate URLs are placeholder `?ref=couponchrome` links.
- Never commit `.env` — Vercel reads env vars from its dashboard, not from your repo.
