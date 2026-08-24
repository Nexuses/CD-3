import mongoose from "mongoose";
import type { OfferWithRelations } from "./utils";

function isObjectId(value: unknown): value is { toString(): string } {
  return (
    value != null &&
    typeof value === "object" &&
    (value instanceof mongoose.Types.ObjectId ||
      (typeof (value as { _bsontype?: string })._bsontype === "string" &&
        (value as { _bsontype: string })._bsontype === "ObjectId"))
  );
}

function serializeValue(value: unknown): unknown {
  if (value == null) return value;
  if (isObjectId(value)) return String(value);
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("_id" in obj && Object.keys(obj).length <= 4) {
      return String(obj._id);
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = serializeValue(v);
    }
    return out;
  }
  return value;
}

export function idOf(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (isObjectId(value)) return String(value);
  if (typeof value === "object" && value && "_id" in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
}

export function asObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

type Lean = Record<string, unknown> & { _id?: unknown };

export function withId<T extends Lean>(doc: T | null | undefined) {
  if (!doc) return null;
  const { _id, __v, ...rest } = doc;
  const plain: Record<string, unknown> = { id: String(_id) };
  for (const [key, value] of Object.entries(rest)) {
    plain[key] = serializeValue(value);
  }
  return plain as T & { id: string };
}

export function mapId<T extends Lean>(docs: T[]) {
  return docs.map((d) => withId(d)!);
}

export function offerShape(doc: Lean): OfferWithRelations {
  const merchantDoc =
    doc.merchantId && typeof doc.merchantId === "object" && "_id" in (doc.merchantId as object)
      ? (doc.merchantId as Lean)
      : null;

  const merchant = {
    id: merchantDoc ? String(merchantDoc._id) : idOf(doc.merchantId),
    slug: String(merchantDoc?.slug ?? ""),
    name: String(merchantDoc?.name ?? ""),
    logo: String(merchantDoc?.logo ?? ""),
  };

  const categories = Array.isArray(doc.categoryIds)
    ? (doc.categoryIds as Lean[])
        .filter((c) => c && typeof c === "object" && "_id" in c)
        .map((c) => ({
          category: {
            id: String(c._id),
            slug: String(c.slug),
            name: String(c.name),
          },
        }))
    : [];

  const bankTags = Array.isArray(doc.bankTags)
    ? (doc.bankTags as string[]).map((tagName) => ({ tagName: String(tagName) }))
    : [];

  const expiry = doc.expiryDate ? new Date(doc.expiryDate as string | Date) : null;

  return {
    id: String(doc._id),
    type: String(doc.type),
    title: String(doc.title),
    subtitle: String(doc.subtitle ?? ""),
    terms: String(doc.terms ?? ""),
    couponCode: doc.couponCode ? String(doc.couponCode) : null,
    affiliateUrl: String(doc.affiliateUrl),
    discountLabel: String(doc.discountLabel ?? ""),
    isExclusive: Boolean(doc.isExclusive),
    clickCount: Number(doc.clickCount ?? 0),
    expiryDate: expiry ? expiry.toISOString() : null,
    merchant,
    categories,
    bankTags,
  };
}
