import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { HeroSlide } from "@/lib/models";
import { mapId, withId } from "@/lib/serialize";
import { revalidateSiteCache } from "@/lib/revalidate-site";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const slides = await HeroSlide.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
  return NextResponse.json(mapId(slides));
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

  const slide = await HeroSlide.create({
    name: String(body.name || title),
    title,
    description: String(body.description || ""),
    ctaLabel: String(body.ctaLabel || "Explore now"),
    href,
    image,
    alt: String(body.alt || title),
    sortOrder: Number(body.sortOrder) || 0,
    isActive: body.isActive !== false,
  });

  revalidateSiteCache();
  return NextResponse.json(withId(slide.toObject()), { status: 201 });
}
