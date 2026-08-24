import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Category, Merchant, Offer } from "@/lib/models";
import { mapId, offerShape } from "@/lib/serialize";
import { OfferCard } from "@/components/offer-card";
import { OfferTabs } from "@/components/offer-tabs";
import { BadgePill } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const cat = await Category.findOne({ slug }).lean();
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

  await connectDB();
  const category = await Category.findOne({ slug }).lean();
  if (!category) notFound();

  const baseFilter = { isActive: true, categoryIds: category._id };
  const typeFilter = type === "coupon" || type === "deal" ? { type } : {};

  const [offerDocs, allCount, couponCount, dealCount] = await Promise.all([
    Offer.find({ ...baseFilter, ...typeFilter })
      .sort({ clickCount: -1 })
      .populate("merchantId", "slug name logo")
      .lean(),
    Offer.countDocuments(baseFilter),
    Offer.countDocuments({ ...baseFilter, type: "coupon" }),
    Offer.countDocuments({ ...baseFilter, type: "deal" }),
  ]);

  const offers = offerDocs.map((o) => offerShape(o));

  const merchantIds = await Offer.distinct("merchantId", baseFilter);
  const topStoreDocs = await Merchant.find({
    isActive: true,
    _id: { $in: merchantIds },
  }).limit(8).lean();

  const offerCounts = await Offer.aggregate([
    { $match: baseFilter },
    { $group: { _id: "$merchantId", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(offerCounts.map((r) => [String(r._id), r.count as number]));

  const topStores = mapId(topStoreDocs).map((s) => ({
    ...s,
    _count: { offers: countMap.get(s.id) || 0 },
  }));

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
                <img src={s.logo as string} alt="" className="w-5 h-5 object-contain" />
                {s.name as string}{" "}
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
