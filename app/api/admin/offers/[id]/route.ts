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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const offer = await Offer.findById(oid)
    .populate("merchantId")
    .populate("categoryIds")
    .lean();
  if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(offerShape(offer));
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

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

  const offer = await Offer.findByIdAndUpdate(
    oid,
    {
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
    },
    { new: true },
  ).lean();
  if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateSiteCache();
  return NextResponse.json(offerShape(offer));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const result = await Offer.findByIdAndDelete(oid);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateSiteCache();
  return NextResponse.json({ ok: true });
}
