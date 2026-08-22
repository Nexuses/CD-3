# CouponChrome

Coupon & deal directory inspired by CouponDunia’s layout, styled with a Nintendo.com ~2001 chrome design system. Phase 1: public browse + admin CRUD (no user cashback/wallet).

## Quick start

```bash
npm install
npx prisma db push
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
| `npm run db:reset` | Reset DB and re-seed |

## What’s included

- **Public:** Home, `/stores` (A–Z), `/category/[slug]`, `/[merchant-slug]`, offer reveal modal, click counter
- **Admin:** Login (cookie session), dashboard stats, CRUD for stores / categories / offers
- **Stack:** Next.js 15, Prisma, PostgreSQL (Supabase), Tailwind CSS v4
- **Design:** Coinbase-inspired institutional UI — white canvas, Coinbase Blue CTAs, dark heroes (`design.md`)

## Deploy to Vercel

1. Push this repo to GitHub (do **not** commit `.env` or `node_modules`).
2. Import the repo on [vercel.com](https://vercel.com).
3. Before or after the first deploy, open **Settings → Environment Variables** and add:

   | Name | Value |
   |------|--------|
   | `DATABASE_URL` | Supabase URI from **Project Settings → Database → Connection string → URI** |
   | `AUTH_SECRET` | Any long random string |

   Enable **Production** (and **Preview** if you use preview deploys).

4. **Redeploy** after saving env vars (Deployments → ⋯ → Redeploy).

Tables and demo data should already exist on Supabase. If the live site is empty, run locally once:

```bash
npx prisma db push
npm run db:seed
```

See [`.env.example`](.env.example) for the variable names.

## Notes

- Demo logos are inline SVG data URIs.
- Affiliate URLs are placeholder `?ref=couponchrome` links.
- Never commit `.env` — Vercel reads env vars from its dashboard, not from your repo.
