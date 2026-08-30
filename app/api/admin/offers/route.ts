import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Offer } from "@/lib/models";
import { asObjectId, offerShape } from "@/lib/serialize";
import { revalidateSiteCache } from "@/lib/revalidate-site";

function parseCategoryIds(body: { categoryIds?: unknown }) {
  if (!Array.isArray(body.categoryIds)) return [];
  return body.categoryIds.map(String).filter((id) => asObjectId(id));
}

function parseBankTags(body: { bankTags?: unknown }) {
  if (Array.isArray(body.bankTags)) {
    return body.bankTags.map(String).filter(Boolean);
  }
  if (typeof body.bankTags === "string") {
    return body.bankTags.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export async function GET(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("store");
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const filter: Record<string, unknown> = {};
  if (storeId) {
    const oid = asObjectId(storeId);
    if (oid) filter.merchantId = oid;
  }
  if (type === "coupon" || type === "deal") filter.type = type;
  if (status === "active") filter.isActive = true;
  if (status === "inactive") filter.isActive = false;

  const offers = await Offer.find(filter)
    .sort({ updatedAt: -1 })
    .populate("merchantId", "id slug name")
    .populate("categoryIds", "slug name")
    .lean();

  return NextResponse.json(offers.map(offerShape));
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const merchantOid = asObjectId(String(body.merchantId || ""));
  const title = String(body.title || "").trim();
  const type = body.type === "coupon" ? "coupon" : "deal";
  const affiliateUrl = String(body.affiliateUrl || "").trim();

  if (!merchantOid || !title || !affiliateUrl) {
    return NextResponse.json(
      { error: "Store, title, and affiliate URL required" },
      { status: 400 },
    );
  }

  const offer = await Offer.create({
    merchantId: merchantOid,
    type,
    title,
    subtitle: String(body.subtitle || ""),
    terms: String(body.terms || ""),
    couponCode: type === "coupon" ? String(body.couponCode || "") || null : null,
    affiliateUrl,
    discountLabel: String(body.discountLabel || ""),
    isExclusive: Boolean(body.isExclusive),
    expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
    isActive: body.isActive !== false,
    categoryIds: parseCategoryIds(body),
    bankTags: parseBankTags(body),
  });
  revalidateSiteCache();
  return NextResponse.json(offerShape(offer.toObject()), { status: 201 });
}
