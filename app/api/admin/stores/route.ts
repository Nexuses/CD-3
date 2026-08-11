import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function guard() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const stores = await prisma.merchant.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { offers: true } } },
  });
  return NextResponse.json(stores);
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  let slug = String(body.slug || slugify(name)).trim() || slugify(name);
  const existing = await prisma.merchant.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const store = await prisma.merchant.create({
    data: {
      name,
      slug,
      logo: String(body.logo || ""),
      websiteUrl: String(body.websiteUrl || ""),
      description: String(body.description || ""),
      seoTitle: String(body.seoTitle || `${name} Coupons & Offers`),
      seoDescription: String(body.seoDescription || ""),
      isActive: body.isActive !== false,
      isFeatured: Boolean(body.isFeatured),
    },
  });
  return NextResponse.json(store, { status: 201 });
}
