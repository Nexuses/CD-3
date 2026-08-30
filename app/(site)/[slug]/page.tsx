import Link from "next/link";
import { notFound } from "next/navigation";
import { OfferCard } from "@/components/offer-card";
import { OfferTabs } from "@/components/offer-tabs";
import { BadgePill, ButtonPrimary, FeatureCard } from "@/components/ui";
import { BrandLogo } from "@/components/store-tile";
import { StoreCouponBanner } from "@/components/store-coupon-banner";
import { getMerchantMetadata, getMerchantPageData } from "@/lib/site-data";

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

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (RESERVED.has(slug)) return { title: "Not Found" };
  const m = await getMerchantMetadata(slug);
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

  const typeFilter = sp.type === "coupon" || sp.type === "deal" ? sp.type : "";
  const categorySlug = sp.category || "";
  const bank = sp.bank || "";

  const data = await getMerchantPageData(slug, typeFilter, categorySlug, bank);
  if (!data) notFound();

  const {
    merchant,
    offers,
    allCount,
    couponCount,
    dealCount,
    totalUses,
    bannerOffers,
    catCounts,
    bankCounts,
    otherStores,
    topCategories,
    activeTypeFilter,
  } = data;

  function filterHref(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const next = {
      type: activeTypeFilter,
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
        → {merchant.name as string}
      </p>

      {bannerOffers.length > 0 && (
        <div className="mb-8">
          <StoreCouponBanner storeName={merchant.name as string} offers={bannerOffers} />
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

            {bankCounts.length > 0 && (
              <div className="mb-4">
                <p className="caption-strong text-ink-subtle mb-2">Bank & wallet</p>
                <ul className="space-y-1">
                  {bankCounts.map(([tag, count]) => (
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

            {catCounts.length > 0 && (
              <div>
                <p className="caption-strong text-ink-subtle mb-2">Categories</p>
                <ul className="space-y-1">
                  {catCounts.map((c) => (
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
              <BrandLogo src={merchant.logo as string} name={merchant.name as string} size={64} />
              <div className="min-w-0 flex-1">
                <BadgePill className="mb-2">Store</BadgePill>
                <h1 className="display-sm text-ink m-0 !text-[28px] md:!text-[36px]">
                  {merchant.name as string} coupons
                </h1>
                <p className="body-sm mt-2 line-clamp-3">{merchant.description as string}</p>
                <a
                  href={merchant.websiteUrl as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4"
                >
                  <ButtonPrimary type="button">Shop at {merchant.name as string}</ButtonPrimary>
                </a>
              </div>
            </div>
          </FeatureCard>

          <OfferTabs
            basePath={`/${slug}`}
            active={activeTypeFilter || "all"}
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
                  <BrandLogo src={s.logo as string} name={s.name as string} size={28} />
                  {s.name as string}
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
                  {c.name as string}
                </Link>
              ))}
            </div>
          </FeatureCard>
        </aside>
      </div>
    </div>
  );
}
