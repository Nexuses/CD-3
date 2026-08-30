import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Merchant, Offer } from "@/lib/models";
import { mapId } from "@/lib/serialize";
import { SpotlightManager } from "@/components/customization/spotlight-manager";

export default async function CustomizationSpotlightPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await connectDB();
  const [merchantDocs, offerDocs] = await Promise.all([
    Merchant.find({ isActive: true }).sort({ name: 1 }).lean(),
    Offer.find({ isActive: true })
      .sort({ title: 1 })
      .populate("merchantId", "name slug logo")
      .lean(),
  ]);

  const merchants = mapId(merchantDocs).map((m) => ({
    id: m.id,
    name: String(m.name),
    slug: String(m.slug),
    logo: String(m.logo || ""),
    isSpotlight: Boolean(m.isSpotlight),
    spotlightImage: String(m.spotlightImage || ""),
    spotlightSubtitle: String(m.spotlightSubtitle || ""),
    spotlightOrder: Number(m.spotlightOrder) || 0,
  }));

  const offers = offerDocs.map((o) => {
    const merchant =
      o.merchantId && typeof o.merchantId === "object" && "_id" in (o.merchantId as object)
        ? {
            name: String((o.merchantId as { name?: string }).name || ""),
            slug: String((o.merchantId as { slug?: string }).slug || ""),
          }
        : null;
    return {
      id: String(o._id),
      title: String(o.title),
      subtitle: String(o.subtitle || ""),
      discountLabel: String(o.discountLabel || ""),
      isSpotlight: Boolean(o.isSpotlight),
      spotlightImage: String(o.spotlightImage || ""),
      spotlightSubtitle: String(o.spotlightSubtitle || ""),
      spotlightOrder: Number(o.spotlightOrder) || 0,
      merchant,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="caption mb-2">
          <Link href="/admin/customization" className="hover:text-ink">
            Customization
          </Link>{" "}
          → Spotlight
        </p>
        <h1 className="display-sm text-ink m-0 !text-[28px]">Spotlight coupons</h1>
        <p className="body-sm mt-2 mb-0 text-muted">
          Enable spotlight for stores or individual offers. Lower order numbers appear first.
        </p>
      </div>
      <SpotlightManager merchants={merchants} offers={offers} />
    </div>
  );
}
