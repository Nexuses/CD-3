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
- **Stack:** Next.js 15, Prisma, PostgreSQL, Tailwind CSS v4
- **Design:** Coinbase-inspired institutional UI — white canvas, Coinbase Blue CTAs, dark heroes (`design.md`)

## Notes

- Demo logos are inline SVG data URIs.
- Affiliate URLs are placeholder `?ref=couponchrome` links.
- Change `AUTH_SECRET` in `.env` before deploying.
