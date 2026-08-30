import { unstable_cache } from "next/cache";
import { connectDB } from "./mongodb";
import { Category, Merchant, Offer } from "./models";
import { offerCountsByCategory } from "./db-helpers";
import { mapId, offerShape, withId } from "./serialize";
import { SITE_CACHE_TAGS, SITE_REVALIDATE } from "./site-cache";

async function loadNavData() {
  await connectDB();
  const [categories, merchants] = await Promise.all([
    Category.find({ parentId: null }).sort({ name: 1 }).lean(),
    Merchant.find({ isActive: true }).sort({ isFeatured: -1, name: 1 }).limit(12).lean(),
  ]);

  const merchantIds = merchants.map((m) => m._id);
  const offerCounts = await Offer.aggregate([
    { $match: { isActive: true, merchantId: { $in: merchantIds } } },
    { $group: { _id: "$merchantId", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(offerCounts.map((r) => [String(r._id), r.count as number]));

  const catIds = categories.map((c) => c._id);
  const catCounts = await Offer.aggregate([
    { $match: { isActive: true, categoryIds: { $in: catIds } } },
    { $unwind: "$categoryIds" },
    { $match: { categoryIds: { $in: catIds } } },
    { $group: { _id: "$categoryIds", count: { $sum: 1 } } },
  ]);
  const catCountMap = new Map(catCounts.map((r) => [String(r._id), r.count as number]));

  return {
    categories: mapId(categories).map((c) => ({
      id: c.id,
      slug: String(c.slug),
      name: String(c.name),
      _count: { offers: catCountMap.get(c.id) || 0 },
    })),
    topStores: merchants.map((m) => {
      const row = withId(m)!;
      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        logo: row.logo,
        offerCount: countMap.get(String(m._id)) || 0,
      };
    }),
  };
}

export const getNavData = unstable_cache(loadNavData, ["site-nav-data"], {
  revalidate: SITE_REVALIDATE,
  tags: [SITE_CACHE_TAGS.nav, SITE_CACHE_TAGS.categories, SITE_CACHE_TAGS.merchants],
});

async function loadHomePageListingData() {
  await connectDB();

  const [merchantDocs, categoryDocs, todayDocs, exclusiveDocs] = await Promise.all([
    Merchant.find({ isActive: true }).sort({ isFeatured: -1, name: 1 }).lean(),
    Category.find({ parentId: null }).sort({ name: 1 }).lean(),
    Offer.find({ isActive: true })
      .sort({ clickCount: -1 })
      .limit(8)
      .populate("merchantId", "slug name logo")
      .lean(),
    Offer.find({ isActive: true, isExclusive: true })
      .sort({ clickCount: -1 })
      .limit(4)
      .populate("merchantId", "slug name logo")
      .lean(),
  ]);

  const offerTypeCounts = await Offer.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: { merchantId: "$merchantId", type: "$type" }, count: { $sum: 1 } } },
  ]);
  const offersByMerchant = new Map<string, { type: string }[]>();
  for (const row of offerTypeCounts) {
    const key = String(row._id.merchantId);
    const list = offersByMerchant.get(key) || [];
    for (let i = 0; i < row.count; i++) list.push({ type: row._id.type });
    offersByMerchant.set(key, list);
  }

  return {
    merchants: merchantDocs.map((m) => ({
      ...withId(m)!,
      offers: offersByMerchant.get(String(m._id)) || [],
    })),
    categories: mapId(categoryDocs),
    todaysOffers: todayDocs.map((o) => offerShape(o)),
    exclusiveOffers: exclusiveDocs.map((o) => offerShape(o)),
  };
}

export const getHomePageListingData = unstable_cache(
  loadHomePageListingData,
  ["site-home-listing"],
  {
    revalidate: SITE_REVALIDATE,
    tags: [
      SITE_CACHE_TAGS.home,
      SITE_CACHE_TAGS.merchants,
      SITE_CACHE_TAGS.categories,
      SITE_CACHE_TAGS.offers,
    ],
  },
);

async function loadStoresDirectoryData() {
  await connectDB();

  const [categoryDocs, offerCounts, merchantDocs, offerTypeRows] = await Promise.all([
    Category.find({ parentId: null }).sort({ name: 1 }).lean(),
    offerCountsByCategory(true),
    Merchant.find({ isActive: true }).sort({ name: 1 }).lean(),
    Offer.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: { merchantId: "$merchantId", type: "$type" }, count: { $sum: 1 } } },
    ]),
  ]);

  const categories = mapId(categoryDocs).map((c) => ({
    ...c,
    _count: { offers: offerCounts.get(c.id) || 0 },
  }));

  const offersByMerchant = new Map<string, { type: string }[]>();
  for (const row of offerTypeRows) {
    const key = String(row._id.merchantId);
    const list = offersByMerchant.get(key) || [];
    for (let i = 0; i < row.count; i++) list.push({ type: row._id.type });
    offersByMerchant.set(key, list);
  }

  const merchants = mapId(merchantDocs).map((m) => ({
    ...m,
    offers: offersByMerchant.get(m.id) || [],
  }));

  return { categories, merchants };
}

export const getStoresDirectoryData = unstable_cache(
  loadStoresDirectoryData,
  ["site-stores-directory"],
  {
    revalidate: SITE_REVALIDATE,
    tags: [SITE_CACHE_TAGS.stores, SITE_CACHE_TAGS.merchants, SITE_CACHE_TAGS.categories],
  },
);

export function merchantPageCacheKey(filters: {
  type?: string;
  category?: string;
  bank?: string;
}) {
  return [filters.type || "", filters.category || "", filters.bank || ""].join("|");
}

async function loadMerchantPageData(
  slug: string,
  typeFilter: string,
  categorySlug: string,
  bank: string,
) {
  await connectDB();
  const merchantDoc = await Merchant.findOne({ slug, isActive: true }).lean();
  if (!merchantDoc) return null;

  const filter: Record<string, unknown> = {
    merchantId: merchantDoc._id,
    isActive: true,
  };
  if (typeFilter === "coupon" || typeFilter === "deal") filter.type = typeFilter;
  if (bank) filter.bankTags = bank;
  if (categorySlug) {
    const cat = await Category.findOne({ slug: categorySlug }).select("_id").lean();
    if (cat) filter.categoryIds = cat._id;
  }

  const [offerDocs, allCount, couponCount, dealCount, allOffersForFilters, otherStoreDocs, topCategoryDocs] =
    await Promise.all([
      Offer.find(filter)
        .sort({ clickCount: -1 })
        .populate("merchantId", "slug name logo")
        .populate("categoryIds", "slug name")
        .lean(),
      Offer.countDocuments({ merchantId: merchantDoc._id, isActive: true }),
      Offer.countDocuments({ merchantId: merchantDoc._id, isActive: true, type: "coupon" }),
      Offer.countDocuments({ merchantId: merchantDoc._id, isActive: true, type: "deal" }),
      Offer.find({ merchantId: merchantDoc._id, isActive: true })
        .populate("categoryIds", "slug name")
        .lean(),
      Merchant.find({ isActive: true, _id: { $ne: merchantDoc._id } })
        .sort({ name: 1 })
        .limit(6)
        .lean(),
      Category.find({ parentId: null }).sort({ name: 1 }).limit(8).lean(),
    ]);

  const merchant = withId(merchantDoc)!;
  const offers = offerDocs.map((o) => offerShape(o));

  const catCounts = new Map<string, { slug: string; name: string; count: number }>();
  const bankCounts = new Map<string, number>();
  for (const o of allOffersForFilters) {
    const cats = Array.isArray(o.categoryIds) ? o.categoryIds : [];
    for (const c of cats) {
      if (!c || typeof c !== "object" || !("_id" in c)) continue;
      const cat = c as { slug: string; name: string };
      const prev = catCounts.get(cat.slug);
      if (prev) prev.count += 1;
      else catCounts.set(cat.slug, { slug: cat.slug, name: cat.name, count: 1 });
    }
    for (const tag of o.bankTags || []) {
      bankCounts.set(tag, (bankCounts.get(tag) || 0) + 1);
    }
  }

  const totalUses = allOffersForFilters.reduce((s, o) => s + o.clickCount, 0);
  const merchantInfo = {
    id: merchant.id,
    slug: merchant.slug as string,
    name: merchant.name as string,
    logo: merchant.logo as string,
  };

  const bannerOffers = [...allOffersForFilters]
    .filter((o) => o.type === "coupon")
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 3)
    .map((o) => ({
      id: String(o._id),
      type: o.type,
      title: o.title,
      subtitle: o.subtitle,
      couponCode: o.couponCode,
      affiliateUrl: o.affiliateUrl,
      discountLabel: o.discountLabel,
      isExclusive: o.isExclusive,
      merchant: merchantInfo,
    }));

  if (bannerOffers.length < 3) {
    const extras = [...allOffersForFilters]
      .sort((a, b) => b.clickCount - a.clickCount)
      .filter((o) => !bannerOffers.some((b) => b.id === String(o._id)))
      .slice(0, 3 - bannerOffers.length)
      .map((o) => ({
        id: String(o._id),
        type: o.type,
        title: o.title,
        subtitle: o.subtitle,
        couponCode: o.couponCode,
        affiliateUrl: o.affiliateUrl,
        discountLabel: o.discountLabel,
        isExclusive: o.isExclusive,
        merchant: merchantInfo,
      }));
    bannerOffers.push(...extras);
  }

  return {
    merchant,
    offers,
    allCount,
    couponCount,
    dealCount,
    totalUses,
    bannerOffers,
    catCounts: [...catCounts.values()],
    bankCounts: [...bankCounts.entries()],
    otherStores: mapId(otherStoreDocs),
    topCategories: mapId(topCategoryDocs),
    activeTypeFilter: typeFilter === "coupon" || typeFilter === "deal" ? typeFilter : undefined,
    categorySlug,
    bank,
  };
}

export async function getMerchantPageData(
  slug: string,
  typeFilter = "",
  categorySlug = "",
  bank = "",
) {
  return unstable_cache(
    () => loadMerchantPageData(slug, typeFilter, categorySlug, bank),
    ["site-merchant-page", slug, typeFilter, categorySlug, bank],
    {
      revalidate: SITE_REVALIDATE,
      tags: [
        SITE_CACHE_TAGS.merchants,
        SITE_CACHE_TAGS.merchant(slug),
        SITE_CACHE_TAGS.offers,
      ],
    },
  )();
}

async function loadMerchantMetadata(slug: string) {
  await connectDB();
  const m = await Merchant.findOne({ slug }).lean();
  if (!m) return null;
  return {
    seoTitle: m.seoTitle as string,
    seoDescription: m.seoDescription as string,
    name: m.name as string,
    description: m.description as string,
  };
}

export async function getMerchantMetadata(slug: string) {
  return unstable_cache(
    () => loadMerchantMetadata(slug),
    ["site-merchant-meta", slug],
    {
      revalidate: SITE_REVALIDATE,
      tags: [SITE_CACHE_TAGS.merchants, SITE_CACHE_TAGS.merchant(slug)],
    },
  )();
}

async function loadCategoryPageData(slug: string, type: string) {
  await connectDB();
  const category = await Category.findOne({ slug }).lean();
  if (!category) return null;

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

  const merchantIds = await Offer.distinct("merchantId", baseFilter);
  const topStoreDocs = await Merchant.find({
    isActive: true,
    _id: { $in: merchantIds },
  })
    .limit(8)
    .lean();

  const offerCounts = await Offer.aggregate([
    { $match: baseFilter },
    { $group: { _id: "$merchantId", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(offerCounts.map((r) => [String(r._id), r.count as number]));

  return {
    category: {
      id: String(category._id),
      slug: String(category.slug),
      name: String(category.name),
    },
    offers: offerDocs.map((o) => offerShape(o)),
    allCount,
    couponCount,
    dealCount,
    topStores: mapId(topStoreDocs).map((s) => ({
      ...s,
      _count: { offers: countMap.get(s.id) || 0 },
    })),
    activeType: type === "coupon" || type === "deal" ? type : undefined,
  };
}

export async function getCategoryPageData(slug: string, type = "") {
  return unstable_cache(
    () => loadCategoryPageData(slug, type),
    ["site-category-page", slug, type],
    {
      revalidate: SITE_REVALIDATE,
      tags: [
        SITE_CACHE_TAGS.categories,
        SITE_CACHE_TAGS.category(slug),
        SITE_CACHE_TAGS.offers,
      ],
    },
  )();
}

export async function getCategoryMetadata(slug: string) {
  return unstable_cache(
    async () => {
      await connectDB();
      const cat = await Category.findOne({ slug }).lean();
      if (!cat) return null;
      return { name: String(cat.name) };
    },
    ["site-category-meta", slug],
    {
      revalidate: SITE_REVALIDATE,
      tags: [SITE_CACHE_TAGS.categories, SITE_CACHE_TAGS.category(slug)],
    },
  )();
}
