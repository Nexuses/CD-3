import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Merchant } from "@/lib/models";
import { offerCountsByMerchant } from "@/lib/db-helpers";
import { mapId, withId } from "@/lib/serialize";
import { slugify } from "@/lib/utils";

async function guard() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const [stores, offerCounts] = await Promise.all([
    Merchant.find().sort({ name: 1 }).lean(),
    offerCountsByMerchant(),
  ]);
  return NextResponse.json(
    mapId(stores).map((s) => ({
      ...s,
      _count: { offers: offerCounts.get(s.id) || 0 },
    })),
  );
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  let slug = String(body.slug || slugify(name)).trim() || slugify(name);
  if (await Merchant.findOne({ slug })) slug = `${slug}-${Date.now().toString(36)}`;

  const store = await Merchant.create({
    name,
    slug,
    logo: String(body.logo || ""),
    websiteUrl: String(body.websiteUrl || ""),
    description: String(body.description || ""),
    seoTitle: String(body.seoTitle || `${name} Coupons & Offers`),
    seoDescription: String(body.seoDescription || ""),
    isActive: body.isActive !== false,
    isFeatured: Boolean(body.isFeatured),
  });
  return NextResponse.json(withId(store.toObject()), { status: 201 });
}
