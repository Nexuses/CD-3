import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OfferCard } from "@/components/offer-card";
import { OfferTabs } from "@/components/offer-tabs";
import { BadgePill, ButtonPrimary, FeatureCard } from "@/components/ui";
import { BrandLogo } from "@/components/store-tile";
import { StoreCouponBanner } from "@/components/store-coupon-banner";

const RESERVED = new Set([
  "stores",
  "category",
  "admin",
  "api",
  "how-it-works",
  "faq",
  "about",
  "privacy",
  "terms",
  "contact",
  "_next",
  "favicon.ico",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (RESERVED.has(slug)) return { title: "Not Found" };
  const m = await prisma.merchant.findUnique({ where: { slug } });
  if (!m) return { title: "Store" };
  return {
    title: m.seoTitle || `${m.name} Coupons & Offers`,
    description: m.seoDescription || m.description,
  };
}

export default async function MerchantPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string; category?: string; bank?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  if (RESERVED.has(slug)) notFound();

  const merchant = await prisma.merchant.findUnique({
    where: { slug, isActive: true },
  });
  if (!merchant) notFound();

  const typeFilter = sp.type === "coupon" || sp.type === "deal" ? sp.type : undefined;
  const categorySlug = sp.category || "";
  const bank = sp.bank || "";

  const offers = await prisma.offer.findMany({
    where: {
      merchantId: merchant.id,
      isActive: true,
      ...(typeFilter ? { type: typeFilter } : {}),
      ...(categorySlug
        ? { categories: { some: { category: { slug: categorySlug } } } }
        : {}),
      ...(bank ? { bankTags: { some: { tagName: bank } } } : {}),
    },
    orderBy: { clickCount: "desc" },
    include: {
      merchant: { select: { id: true, slug: true, name: true, logo: true } },
      bankTags: true,
      categories: { include: { category: true } },
    },
  });

  const [allCount, couponCount, dealCount] = await Promise.all([
    prisma.offer.count({ where: { merchantId: merchant.id, isActive: true } }),
    prisma.offer.count({
      where: { merchantId: merchant.id, isActive: true, type: "coupon" },
    }),
    prisma.offer.count({
      where: { merchantId: merchant.id, isActive: true, type: "deal" },
    }),
  ]);

  const allOffersForFilters = await prisma.offer.findMany({
    where: { merchantId: merchant.id, isActive: true },
    include: {
      categories: { include: { category: true } },
      bankTags: true,
    },
  });

  const catCounts = new Map<string, { slug: string; name: string; count: number }>();
  const bankCounts = new Map<string, number>();
  for (const o of allOffersForFilters) {
    for (const oc of o.categories) {
      const prev = catCounts.get(oc.category.slug);
      if (prev) prev.count += 1;
      else
        catCounts.set(oc.category.slug, {
          slug: oc.category.slug,
          name: oc.category.name,
          count: 1,
        });
    }
    for (const b of o.bankTags) {
      bankCounts.set(b.tagName, (bankCounts.get(b.tagName) || 0) + 1);
    }
  }

  const totalUses = allOffersForFilters.reduce((s, o) => s + o.clickCount, 0);

  const bannerOffers = [...allOffersForFilters]
    .filter((o) => o.type === "coupon")
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 3)
    .map((o) => ({
      id: o.id,
      type: o.type,
      title: o.title,
      subtitle: o.subtitle,
      couponCode: o.couponCode,
      affiliateUrl: o.affiliateUrl,
      discountLabel: o.discountLabel,
      isExclusive: o.isExclusive,
      merchant: {
        id: merchant.id,
        slug: merchant.slug,
        name: merchant.name,
        logo: merchant.logo,
      },
    }));

  // If fewer than 3 coupons, fill with top deals/offers
  if (bannerOffers.length < 3) {
    const extras = [...allOffersForFilters]
      .sort((a, b) => b.clickCount - a.clickCount)
      .filter((o) => !bannerOffers.some((b) => b.id === o.id))
      .slice(0, 3 - bannerOffers.length)
      .map((o) => ({
        id: o.id,
        type: o.type,
        title: o.title,
        subtitle: o.subtitle,
        couponCode: o.couponCode,
        affiliateUrl: o.affiliateUrl,
        discountLabel: o.discountLabel,
        isExclusive: o.isExclusive,
        merchant: {
          id: merchant.id,
          slug: merchant.slug,
          name: merchant.name,
          logo: merchant.logo,
        },
      }));
    bannerOffers.push(...extras);
  }

  const [otherStores, topCategories] = await Promise.all([
    prisma.merchant.findMany({
      where: { isActive: true, NOT: { id: merchant.id } },
      take: 6,
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      where: { parentId: null },
      take: 8,
      orderBy: { name: "asc" },
    }),
  ]);

  function filterHref(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const next = {
      type: typeFilter,
      category: categorySlug || undefined,
      bank: bank || undefined,
      ...overrides,
    };
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const s = params.toString();
    return s ? `/${slug}?${s}` : `/${slug}`;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-10 md:py-16">
      <p className="caption mb-6">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        →{" "}
        <Link href="/stores" className="hover:text-ink">
          Stores
        </Link>{" "}
        → {merchant.name}
      </p>

      {bannerOffers.length > 0 && (
        <div className="mb-8">
          <StoreCouponBanner storeName={merchant.name} offers={bannerOffers} />
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-4 order-2 lg:order-1">
          <FeatureCard className="!p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="title-sm m-0">Filters</h2>
              <Link href={`/${slug}`} className="caption text-fin-orange">
                Clear
              </Link>
            </div>

            {bankCounts.size > 0 && (
              <div className="mb-4">
                <p className="caption-strong text-ink-subtle mb-2">Bank & wallet</p>
                <ul className="space-y-1">
                  {[...bankCounts.entries()].map(([tag, count]) => (
                    <li key={tag}>
                      <Link
                        href={filterHref({ bank: bank === tag ? undefined : tag })}
                        className={`flex text-sm px-2 py-1.5 rounded-md gap-1 ${
                          bank === tag
                            ? "bg-fin-orange/10 text-fin-orange font-medium"
                            : "text-ink-muted hover:bg-canvas hover:text-ink"
                        }`}
                      >
                        {tag}
                        <span className="ml-auto number-display text-xs text-muted">
                          {count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {catCounts.size > 0 && (
              <div>
                <p className="caption-strong text-ink-subtle mb-2">Categories</p>
                <ul className="space-y-1">
                  {[...catCounts.values()].map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={filterHref({
                          category: categorySlug === c.slug ? undefined : c.slug,
                        })}
                        className={`flex text-sm px-2 py-1.5 rounded-md gap-1 ${
                          categorySlug === c.slug
                            ? "bg-fin-orange/10 text-fin-orange font-medium"
                            : "text-ink-muted hover:bg-canvas hover:text-ink"
                        }`}
                      >
                        {c.name}
                        <span className="ml-auto number-display text-xs text-muted">
                          {c.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </FeatureCard>
        </aside>

        <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
          <FeatureCard className="!p-6">
            <div className="flex gap-4 items-start">
              <BrandLogo src={merchant.logo} name={merchant.name} size={64} />
              <div className="min-w-0 flex-1">
                <BadgePill className="mb-2">Store</BadgePill>
                <h1 className="display-sm text-ink m-0 !text-[28px] md:!text-[36px]">
                  {merchant.name} coupons
                </h1>
                <p className="body-sm mt-2 line-clamp-3">{merchant.description}</p>
                <a
                  href={merchant.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4"
                >
                  <ButtonPrimary type="button">Shop at {merchant.name}</ButtonPrimary>
                </a>
              </div>
            </div>
          </FeatureCard>

          <OfferTabs
            basePath={`/${slug}`}
            active={typeFilter || "all"}
            counts={{ all: allCount, coupon: couponCount, deal: dealCount }}
          />

          <div className="space-y-4">
            {offers.length === 0 ? (
              <p className="body-md text-center py-12">No offers match your filters.</p>
            ) : (
              offers.map((o) => <OfferCard key={o.id} offer={o} />)
            )}
          </div>
        </div>

        <aside className="lg:col-span-3 space-y-4 order-3">
          <FeatureCard className="!p-4">
            <h2 className="title-sm mb-3">Summary</h2>
            <dl className="body-sm space-y-2 m-0">
              <div className="flex justify-between">
                <dt>Total offers</dt>
                <dd className="number-display text-sm m-0 text-ink">{allCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Coupons</dt>
                <dd className="number-display text-sm m-0 text-ink">{couponCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Deals</dt>
                <dd className="number-display text-sm m-0 text-ink">{dealCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt>All-time clicks</dt>
                <dd className="number-display text-sm m-0 text-ink">{totalUses}</dd>
              </div>
            </dl>
          </FeatureCard>

          <FeatureCard className="!p-4">
            <h2 className="title-sm mb-3">Top stores</h2>
            <div className="space-y-2">
              {otherStores.map((s) => (
                <Link
                  key={s.id}
                  href={`/${s.slug}`}
                  className="flex items-center gap-2 py-1.5 text-sm font-medium hover:text-fin-orange"
                >
                  <BrandLogo src={s.logo} name={s.name} size={28} />
                  {s.name}
                </Link>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard className="!p-4">
            <h2 className="title-sm mb-3">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {topCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="caption-strong px-2.5 py-1 rounded-md bg-surface-2 hover:bg-hairline"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </FeatureCard>
        </aside>
      </div>
    </div>
  );
}
