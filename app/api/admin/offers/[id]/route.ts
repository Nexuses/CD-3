import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  const offer = await prisma.offer.findUnique({
    where: { id },
    include: {
      merchant: true,
      categories: true,
      bankTags: true,
    },
  });
  if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(offer);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
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

  try {
    await prisma.offerCategory.deleteMany({ where: { offerId: id } });
    await prisma.offerBankTag.deleteMany({ where: { offerId: id } });

    const offer = await prisma.offer.update({
      where: { id },
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
    return NextResponse.json(offer);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  try {
    await prisma.offer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
