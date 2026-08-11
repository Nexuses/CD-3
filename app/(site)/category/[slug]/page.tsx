import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OfferCard } from "@/components/offer-card";
import { OfferTabs } from "@/components/offer-tabs";
import { BadgePill } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) return { title: "Category" };
  return {
    title: `${cat.name} Coupons & Offers`,
    description: `Latest ${cat.name} coupons, promo codes, and deals on CouponChrome.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { slug } = await params;
  const { type } = await searchParams;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const offers = await prisma.offer.findMany({
    where: {
      isActive: true,
      categories: { some: { categoryId: category.id } },
      ...(type === "coupon" || type === "deal" ? { type } : {}),
    },
    orderBy: { clickCount: "desc" },
    include: {
      merchant: { select: { id: true, slug: true, name: true, logo: true } },
      bankTags: true,
    },
  });

  const [allCount, couponCount, dealCount] = await Promise.all([
    prisma.offer.count({
      where: { isActive: true, categories: { some: { categoryId: category.id } } },
    }),
    prisma.offer.count({
      where: {
        isActive: true,
        type: "coupon",
        categories: { some: { categoryId: category.id } },
      },
    }),
    prisma.offer.count({
      where: {
        isActive: true,
        type: "deal",
        categories: { some: { categoryId: category.id } },
      },
    }),
  ]);

  const topStores = await prisma.merchant.findMany({
    where: {
      isActive: true,
      offers: {
        some: {
          isActive: true,
          categories: { some: { categoryId: category.id } },
        },
      },
    },
    take: 8,
    include: {
      _count: {
        select: {
          offers: {
            where: {
              isActive: true,
              categories: { some: { categoryId: category.id } },
            },
          },
        },
      },
    },
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-10 md:py-16 space-y-8">
      <div>
        <p className="caption mb-3">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>{" "}
          →{" "}
          <Link href="/stores" className="hover:text-ink">
            Categories
          </Link>{" "}
          → {category.name}
        </p>
        <BadgePill className="mb-3">Category</BadgePill>
        <h1 className="display-sm text-ink m-0">{category.name} coupons & offers</h1>
        <p className="body-md mt-3 max-w-2xl">
          Discover verified {category.name.toLowerCase()} coupons and deals from top stores.
          Updated daily on CouponChrome.
        </p>
      </div>

      {topStores.length > 0 && (
        <div>
          <h2 className="title-md text-ink mb-3">Top stores in {category.name}</h2>
          <div className="flex flex-wrap gap-2">
            {topStores.map((s) => (
              <Link
                key={s.id}
                href={`/${s.slug}`}
                className="nav-link rounded-md bg-surface-1 border border-hairline px-4 py-2 hover:border-ink inline-flex items-center gap-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.logo} alt="" className="w-5 h-5 object-contain" />
                {s.name}{" "}
                <span className="text-xs text-ink-tertiary">({s._count.offers})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <OfferTabs
        basePath={`/category/${slug}`}
        active={type || "all"}
        counts={{ all: allCount, coupon: couponCount, deal: dealCount }}
      />

      <div className="space-y-4">
        {offers.length === 0 ? (
          <p className="body-md text-center py-12">No offers in this category right now.</p>
        ) : (
          offers.map((o) => <OfferCard key={o.id} offer={o} />)
        )}
      </div>
    </div>
  );
}
