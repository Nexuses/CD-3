import { connectDB } from "./mongodb";
import { Category, Merchant, Offer } from "./models";
import { mapId, offerShape } from "./serialize";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function searchSite(query: string) {
  const q = query.trim();
  if (!q) {
    return { merchants: [], categories: [], offers: [] };
  }

  await connectDB();
  const regex = new RegExp(escapeRegex(q), "i");

  const [merchantDocs, categoryDocs, offerDocs] = await Promise.all([
    Merchant.find({
      isActive: true,
      $or: [{ name: regex }, { slug: regex }, { description: regex }],
    })
      .sort({ isFeatured: -1, name: 1 })
      .limit(48)
      .lean(),
    Category.find({
      $or: [{ name: regex }, { slug: regex }],
    })
      .sort({ name: 1 })
      .limit(12)
      .lean(),
    Offer.find({
      isActive: true,
      $or: [{ title: regex }, { subtitle: regex }, { discountLabel: regex }],
    })
      .sort({ clickCount: -1 })
      .limit(24)
      .populate("merchantId", "slug name logo")
      .lean(),
  ]);

  const merchantIds = merchantDocs.map((m) => m._id);
  const offerTypeRows =
    merchantIds.length > 0
      ? await Offer.aggregate([
          { $match: { isActive: true, merchantId: { $in: merchantIds } } },
          { $group: { _id: { merchantId: "$merchantId", type: "$type" }, count: { $sum: 1 } } },
        ])
      : [];

  const offersByMerchant = new Map<string, { type: string }[]>();
  for (const row of offerTypeRows) {
    const key = String(row._id.merchantId);
    const list = offersByMerchant.get(key) || [];
    for (let i = 0; i < row.count; i++) list.push({ type: row._id.type });
    offersByMerchant.set(key, list);
  }

  return {
    merchants: mapId(merchantDocs).map((m) => ({
      ...m,
      offers: offersByMerchant.get(m.id) || [],
    })),
    categories: mapId(categoryDocs),
    offers: offerDocs.map((o) => offerShape(o)),
  };
}
