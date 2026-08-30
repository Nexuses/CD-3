import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Merchant, Offer } from "@/lib/models";
import { asObjectId, mapId } from "@/lib/serialize";
import { revalidateSiteCache } from "@/lib/revalidate-site";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const [merchants, offers] = await Promise.all([
    Merchant.find({ isActive: true }).sort({ name: 1 }).lean(),
    Offer.find({ isActive: true })
      .sort({ title: 1 })
      .populate("merchantId", "name slug logo")
      .lean(),
  ]);

  return NextResponse.json({
    merchants: mapId(merchants),
    offers: offers.map((o) => {
      const merchant =
        o.merchantId && typeof o.merchantId === "object" && "_id" in (o.merchantId as object)
          ? {
              id: String((o.merchantId as { _id: unknown })._id),
              name: String((o.merchantId as { name?: string }).name || ""),
              slug: String((o.merchantId as { slug?: string }).slug || ""),
            }
          : null;
      return {
        id: String(o._id),
        title: o.title,
        subtitle: o.subtitle,
        discountLabel: o.discountLabel,
        isSpotlight: o.isSpotlight,
        spotlightImage: o.spotlightImage,
        spotlightSubtitle: o.spotlightSubtitle,
        spotlightOrder: o.spotlightOrder,
        merchant,
      };
    }),
  });
}

export async function PATCH(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();

  if (Array.isArray(body.merchants)) {
    for (const item of body.merchants) {
      const oid = asObjectId(String(item.id || ""));
      if (!oid) continue;
      await Merchant.findByIdAndUpdate(oid, {
        isSpotlight: Boolean(item.isSpotlight),
        spotlightImage: String(item.spotlightImage ?? ""),
        spotlightSubtitle: String(item.spotlightSubtitle ?? ""),
        spotlightOrder: Number(item.spotlightOrder) || 0,
      });
    }
  }

  if (Array.isArray(body.offers)) {
    for (const item of body.offers) {
      const oid = asObjectId(String(item.id || ""));
      if (!oid) continue;
      await Offer.findByIdAndUpdate(oid, {
        isSpotlight: Boolean(item.isSpotlight),
        spotlightImage: String(item.spotlightImage ?? ""),
        spotlightSubtitle: String(item.spotlightSubtitle ?? ""),
        spotlightOrder: Number(item.spotlightOrder) || 0,
      });
    }
  }

  revalidateSiteCache();
  return GET();
}
