import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("store");
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const offers = await prisma.offer.findMany({
    where: {
      ...(storeId ? { merchantId: Number(storeId) } : {}),
      ...(type === "coupon" || type === "deal" ? { type } : {}),
      ...(status === "active" ? { isActive: true } : {}),
      ...(status === "inactive" ? { isActive: false } : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: {
      merchant: { select: { id: true, name: true, slug: true } },
      categories: { include: { category: true } },
      bankTags: true,
    },
  });
  return NextResponse.json(offers);
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const merchantId = Number(body.merchantId);
  const title = String(body.title || "").trim();
  const type = body.type === "coupon" ? "coupon" : "deal";
  const affiliateUrl = String(body.affiliateUrl || "").trim();

  if (!merchantId || !title || !affiliateUrl) {
    return NextResponse.json(
      { error: "Store, title, and affiliate URL required" },
      { status: 400 },
    );
  }

  const categoryIds: number[] = Array.isArray(body.categoryIds)
    ? body.categoryIds.map(Number).filter(Boolean)
    : [];
  const bankTags: string[] = Array.isArray(body.bankTags)
    ? body.bankTags.map(String).filter(Boolean)
    : typeof body.bankTags === "string"
      ? body.bankTags.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

  const offer = await prisma.offer.create({
    data: {
      merchantId,
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
      categories: {
        create: categoryIds.map((categoryId) => ({ categoryId })),
      },
      bankTags: {
        create: bankTags.map((tagName) => ({ tagName })),
      },
    },
  });
  return NextResponse.json(offer, { status: 201 });
}
