import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { DealBanner } from "@/lib/models";
import { mapId, withId } from "@/lib/serialize";
import { revalidateSiteCache } from "@/lib/revalidate-site";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const deals = await DealBanner.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
  return NextResponse.json(mapId(deals));
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const title = String(body.title || "").trim();
  const href = String(body.href || "").trim();
  const image = String(body.image || "").trim();
  if (!title || !href || !image) {
    return NextResponse.json({ error: "Title, href, and image are required" }, { status: 400 });
  }

  const deal = await DealBanner.create({
    title,
    description: String(body.description || ""),
    ctaLabel: String(body.ctaLabel || "Explore now!"),
    href,
    image,
    alt: String(body.alt || title),
    logo: String(body.logo || ""),
    sortOrder: Number(body.sortOrder) || 0,
    isActive: body.isActive !== false,
  });

  revalidateSiteCache();
  return NextResponse.json(withId(deal.toObject()), { status: 201 });
}
