import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StoreTile } from "@/components/store-tile";
import { OfferCardCompact } from "@/components/offer-card";
import {
  BadgePill,
  FeatureCard,
} from "@/components/ui";
import { HeroBannerCarousel } from "@/components/home/hero-banner-carousel";
import { HomeCategoryRow } from "@/components/home/home-category-row";
import { FeaturedSpotlight } from "@/components/home/featured-spotlight";
import { DealsOfTheWeek } from "@/components/home/deals-of-the-week";
import { RecommendedNewLaunch } from "@/components/home/recommended-new-launch";
import {
  DEAL_BANNERS,
  HERO_SLIDES,
  HOME_CATEGORIES,
  RECOMMENDED_CARDS,
  SPOTLIGHT_COUPONS,
} from "@/lib/home-banners";

export default async function HomePage() {
  const [merchants, categories, todaysOffers, exclusiveOffers] = await Promise.all([
    prisma.merchant.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      include: {
        offers: { where: { isActive: true }, select: { type: true } },
      },
    }),
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
    }),
    prisma.offer.findMany({
      where: { isActive: true },
      orderBy: { clickCount: "desc" },
      take: 8,
      include: {
        merchant: { select: { id: true, slug: true, name: true, logo: true } },
      },
    }),
    prisma.offer.findMany({
      where: { isActive: true, isExclusive: true },
      orderBy: { clickCount: "desc" },
      take: 4,
      include: {
        merchant: { select: { id: true, slug: true, name: true, logo: true } },
      },
    }),
  ]);

  const favouriteStores = [
    { slug: "flipkart", name: "Flipkart", logo: "/logos/flipkart.svg" },
    { slug: "amazon", name: "Amazon", logo: "/logos/amazon.svg" },
    { slug: "myntra", name: "Myntra", logo: "/logos/myntra.svg" },
    { slug: "jio", name: "Jio", logo: "/logos/jio.svg" },
    { slug: "nike", name: "Nike", logo: "/logos/nike.svg" },
    { slug: "swiggy", name: "Swiggy", logo: "/logos/swiggy.svg" },
    { slug: "boat", name: "boAt", logo: "/logos/boat.svg" },
    { slug: "makemytrip", name: "MakeMyTrip", logo: "/logos/makemytrip.svg" },
  ].map((s) => {
    const m = merchants.find((x) => x.slug === s.slug);
    return {
      id: m?.id ?? s.slug,
      slug: s.slug,
      name: m?.name ?? s.name,
      logo: s.logo,
      offers: m?.offers ?? [],
    };
  });

  const storeSummaries = merchants.slice(0, 8).map((m) => {
    const coupons = m.offers.filter((o) => o.type === "coupon").length;
    const deals = m.offers.filter((o) => o.type === "deal").length;
    return {
      slug: m.slug,
      name: m.name,
      logo: m.logo,
      offerCount: m.offers.length,
      couponCount: coupons,
      dealCount: deals,
    };
  });

  const bankTags = ["SBI", "ICICI", "HDFC", "AXIS", "Kotak", "Paytm", "Google Pay", "PhonePe"];
  const totalOffers = merchants.reduce((s, m) => s + m.offers.length, 0);

  const faqs = [
    {
      q: "How do I use a coupon on CouponChrome?",
      a: "Click Get coupon, copy the code, then visit the store and paste it at checkout. For deals, click Get deal to go straight to the offer page.",
    },
    {
      q: "Are these coupons verified?",
      a: "We list active, admin-verified offers and remove expired codes regularly so you see working discounts.",
    },
    {
      q: "Do I need an account to save?",
      a: "No. Browse stores, categories, and reveal coupon codes instantly — no signup required.",
    },
    {
      q: "Can I combine coupons and bank offers?",
      a: "Often yes. Many merchants allow stacking a promo code with eligible card or wallet offers. Check each offer's terms.",
    },
  ];

  return (
    <div>
      <HeroBannerCarousel slides={HERO_SLIDES} />
      <HomeCategoryRow categories={HOME_CATEGORIES} />
      <FeaturedSpotlight coupons={SPOTLIGHT_COUPONS} />
      <DealsOfTheWeek deals={DEAL_BANNERS} />
      <RecommendedNewLaunch cards={RECOMMENDED_CARDS} />

      {/* Favourite stores — Flipkart, Amazon, Myntra, AJIO + more */}
      <section className="section-band bg-canvas">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="eyebrow mb-2">Popular brands</p>
              <h2 className="display-sm text-ink m-0">Choose your favourite stores</h2>
            </div>
            <Link href="/stores" className="btn-label text-fin-orange shrink-0 hidden sm:inline">
              Find more →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
            {favouriteStores.map((m) => (
              <StoreTile
                key={m.id}
                slug={m.slug}
                name={m.name}
                logo={m.logo}
                offerCount={m.offers.length}
                compact
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-band bg-surface-2">
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="eyebrow mb-2">Browse</p>
          <h2 className="display-sm text-ink m-0 mb-6">Top categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="nav-link rounded-md bg-surface-1 border border-hairline px-4 py-2.5 text-ink hover:border-ink"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Store summary grid */}
      <section className="section-band bg-canvas">
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="eyebrow mb-2">Directory</p>
          <h2 className="display-sm text-ink m-0 mb-8">Stores with coupons &amp; deals</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
            {storeSummaries.map((s) => (
              <StoreTile key={s.slug} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Today's offers */}
      <section id="todays-offers" className="section-band bg-surface-2">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <BadgePill>Today&apos;s best offers</BadgePill>
            <BadgePill accent>CC Exclusive</BadgePill>
          </div>
          <h2 className="display-sm text-ink m-0 mb-8">Top online shopping offers</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {Array.from(
              new Map(
                [...todaysOffers.slice(0, 4), ...exclusiveOffers]
                  .map((o) => [o.id, o] as const),
              ).values(),
            )
              .slice(0, 8)
              .map((o) => (
              <div key={o.id} className="w-[240px] shrink-0">
                <OfferCardCompact offer={o} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bank & wallet */}
      <section className="section-band bg-canvas">
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="eyebrow mb-2">Looking for more?</p>
          <h2 className="display-sm text-ink m-0 mb-8">Bank &amp; wallet offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FeatureCard>
              <h3 className="title-md mb-4">Wallet offers</h3>
              <div className="flex flex-wrap gap-2">
                {bankTags.slice(5).map((t) => (
                  <Link
                    key={t}
                    href={`/stores?bank=${encodeURIComponent(t)}`}
                    className="nav-link rounded-md bg-canvas border border-hairline px-4 py-2 hover:border-ink"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </FeatureCard>
            <FeatureCard>
              <h3 className="title-md mb-4">Bank offers</h3>
              <div className="flex flex-wrap gap-2">
                {bankTags.slice(0, 5).map((t) => (
                  <Link
                    key={t}
                    href={`/stores?bank=${encodeURIComponent(t)}`}
                    className="nav-link rounded-md bg-canvas border border-hairline px-4 py-2 hover:border-ink"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Why + FAQ */}
      <section className="section-band bg-surface-2">
        <div className="max-w-[1280px] mx-auto px-4 grid md:grid-cols-2 gap-5">
          <FeatureCard>
            <BadgePill className="mb-4">Why CouponChrome</BadgePill>
            <h2 className="display-sm text-ink m-0 mb-4">Built for real savings</h2>
            <ul className="body-md space-y-2 list-disc pl-5 mb-6">
              <li>Latest verified coupons & deals across top brands</li>
              <li>One platform for fashion, electronics, food, travel & more</li>
              <li>Bank & wallet tags to stack savings</li>
              <li>No signup needed — copy codes instantly</li>
            </ul>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-canvas border border-hairline p-4 text-center">
                <div className="text-2xl font-medium text-ink tracking-tight">{merchants.length}+</div>
                <div className="caption mt-1">Brands</div>
              </div>
              <div className="rounded-lg bg-canvas border border-hairline p-4 text-center">
                <div className="text-2xl font-medium text-ink tracking-tight">{totalOffers}+</div>
                <div className="caption mt-1">Active offers</div>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard>
            <BadgePill className="mb-4">FAQ</BadgePill>
            <h2 className="display-sm text-ink m-0 mb-4">Common questions</h2>
            <div className="space-y-1">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="rounded-md border-b border-hairline-soft px-1 py-3 group"
                >
                  <summary className="title-sm text-ink cursor-pointer list-none flex justify-between gap-2">
                    {f.q}
                    <span className="text-fin-orange group-open:rotate-90 transition">→</span>
                  </summary>
                  <p className="body-sm mt-2 mb-0">{f.a}</p>
                </details>
              ))}
            </div>
          </FeatureCard>
        </div>
      </section>

      {/* CTA banner — image background */}
      <section className="section-band bg-canvas">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="relative overflow-hidden rounded-lg border border-hairline min-h-[380px] md:min-h-[440px] flex items-center justify-center text-center px-6 py-16 md:px-12 md:py-20">
            <img
              src="/images/home/deals/travel.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative z-10 w-full">
              <h2 className="display-md text-white m-0 mb-4">Start saving on your next order</h2>
              <p className="max-w-3xl mx-auto mb-10 text-base leading-normal text-white">
                Browse hundreds of verified coupons and deals — free, fast, no account required.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/stores"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-fin-orange px-6 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Explore all stores
                </Link>
                <Link
                  href="/#todays-offers"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-[#4b5563] transition hover:bg-white/90"
                >
                  See today&apos;s deals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
