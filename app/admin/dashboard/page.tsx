import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Category, Merchant, Offer } from "@/lib/models";
import { mapId, offerShape } from "@/lib/serialize";
import { FeatureCard, ButtonPrimary, ButtonSecondary } from "@/components/ui";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await connectDB();
  const [stores, offers, categories, clicksAgg, recentOfferDocs, recentStoreDocs] =
    await Promise.all([
      Merchant.countDocuments(),
      Offer.countDocuments({ isActive: true }),
      Category.countDocuments(),
      Offer.aggregate([{ $group: { _id: null, total: { $sum: "$clickCount" } } }]),
      Offer.find()
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate("merchantId", "name")
        .lean(),
      Merchant.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

  const totalClicks = (clicksAgg[0]?.total as number) || 0;
  const clicksToday = Math.floor(totalClicks * 0.03);
  const recentOffers = recentOfferDocs.map((o) => {
    const shaped = offerShape(o);
    return {
      id: shaped.id,
      title: shaped.title,
      merchant: { name: shaped.merchant?.name || "" },
    };
  });
  const recentStores = mapId(recentStoreDocs);

  const stats = [
    { label: "Total stores", value: stores, href: "/admin/stores" },
    { label: "Active offers", value: offers, href: "/admin/offers" },
    { label: "Categories", value: categories, href: "/admin/categories" },
    { label: "Clicks (all time)", value: totalClicks, href: "/admin/offers" },
    { label: "Clicks today (est.)", value: clicksToday, href: "/admin/offers" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="display-sm text-ink m-0 !text-[28px]">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <FeatureCard className="!p-4 hover:shadow-soft h-full transition-shadow">
              <div className="number-display text-primary text-2xl">{s.value}</div>
              <div className="caption mt-1">{s.label}</div>
            </FeatureCard>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FeatureCard className="!p-0 overflow-hidden">
          <div className="px-5 pt-5 pb-2">
            <h2 className="title-md m-0">Recent offers</h2>
          </div>
          <ul className="divide-y divide-hairline m-0">
            {recentOffers.map((o) => (
              <li key={o.id} className="px-5 py-3 text-sm flex justify-between gap-2">
                <span className="truncate">
                  <span className="font-semibold text-ink">{o.title}</span>{" "}
                  <span className="text-muted">({o.merchant.name})</span>
                </span>
                <Link href={`/admin/offers/${o.id}`} className="text-primary font-semibold shrink-0">
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        </FeatureCard>
        <FeatureCard className="!p-0 overflow-hidden">
          <div className="px-5 pt-5 pb-2">
            <h2 className="title-md m-0">Recent stores</h2>
          </div>
          <ul className="divide-y divide-hairline m-0">
            {recentStores.map((m) => (
              <li key={m.id} className="px-5 py-3 text-sm flex justify-between gap-2">
                <span className="font-semibold text-ink">{m.name}</span>
                <Link href={`/admin/stores/${m.id}`} className="text-primary font-semibold shrink-0">
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        </FeatureCard>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/stores/new">
          <ButtonSecondary type="button">+ Add store</ButtonSecondary>
        </Link>
        <Link href="/admin/offers/new">
          <ButtonPrimary type="button">+ Add offer</ButtonPrimary>
        </Link>
        <Link href="/admin/categories/new">
          <ButtonSecondary type="button">+ Add category</ButtonSecondary>
        </Link>
      </div>
    </div>
  );
}
