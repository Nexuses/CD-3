import { Offer } from "./models";

export async function offerCountsByCategory(activeOnly = false) {
  const pipeline: Record<string, unknown>[] = [];
  if (activeOnly) pipeline.push({ $match: { isActive: true } });
  pipeline.push(
    { $unwind: "$categoryIds" },
    { $group: { _id: "$categoryIds", count: { $sum: 1 } } },
  );
  const rows = await Offer.aggregate(pipeline);
  return new Map(rows.map((r) => [String(r._id), r.count as number]));
}

export async function offerCountsByMerchant(activeOnly = false) {
  const pipeline: Record<string, unknown>[] = [];
  if (activeOnly) pipeline.push({ $match: { isActive: true } });
  pipeline.push({ $group: { _id: "$merchantId", count: { $sum: 1 } } });
  const rows = await Offer.aggregate(pipeline);
  return new Map(rows.map((r) => [String(r._id), r.count as number]));
}
