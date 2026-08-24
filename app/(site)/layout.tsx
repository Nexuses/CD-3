import { connectDB } from "@/lib/mongodb";
import { Category, Merchant, Offer } from "@/lib/models";
import { mapId, withId } from "@/lib/serialize";
import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";

export const dynamic = "force-dynamic";

async function getNavData() {
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

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories, topStores } = await getNavData();

  return (
    <>
      <SiteHeader categories={categories} topStores={topStores} />
      <main className="flex-1">{children}</main>
      <SiteFooter categories={categories} />
    </>
  );
}
