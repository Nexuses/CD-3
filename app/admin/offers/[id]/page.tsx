import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Category, Merchant, Offer } from "@/lib/models";
import { asObjectId, mapId } from "@/lib/serialize";
import { OfferForm } from "@/components/offer-form";

export default async function EditOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) notFound();

  const [offer, merchants, categories] = await Promise.all([
    Offer.findById(oid).lean(),
    Merchant.find().sort({ name: 1 }).select("name").lean(),
    Category.find().sort({ name: 1 }).select("name").lean(),
  ]);

  if (!offer) notFound();

  const expiryDate = offer.expiryDate
    ? offer.expiryDate.toISOString().slice(0, 10)
    : null;

  return (
    <div className="space-y-3">
      <h1 className="display-sm text-ink m-0 !text-[28px]">Edit offer</h1>
      <OfferForm
        merchants={mapId(merchants).map((m) => ({ id: m.id, name: m.name as string }))}
        categories={mapId(categories).map((c) => ({ id: c.id, name: c.name as string }))}
        initial={{
          id: String(offer._id),
          merchantId: String(offer.merchantId),
          type: offer.type,
          title: offer.title,
          subtitle: offer.subtitle,
          terms: offer.terms,
          couponCode: offer.couponCode,
          affiliateUrl: offer.affiliateUrl,
          discountLabel: offer.discountLabel,
          isExclusive: offer.isExclusive,
          expiryDate,
          isActive: offer.isActive,
          categoryIds: (offer.categoryIds || []).map(String),
          bankTags: offer.bankTags || [],
        }}
      />
    </div>
  );
}
