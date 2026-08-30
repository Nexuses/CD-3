import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { DealBanner } from "@/lib/models";
import { asObjectId, withId } from "@/lib/serialize";
import { revalidateSiteCache } from "@/lib/revalidate-site";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const deal = await DealBanner.findById(oid).lean();
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(withId(deal));
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
  const title = String(body.title || "").trim();
  const href = String(body.href || "").trim();
  const image = String(body.image || "").trim();
  if (!title || !href || !image) {
    return NextResponse.json({ error: "Title, href, and image are required" }, { status: 400 });
  }

  const deal = await DealBanner.findByIdAndUpdate(
    oid,
    {
      title,
      description: String(body.description || ""),
      ctaLabel: String(body.ctaLabel || "Explore now!"),
      href,
      image,
      alt: String(body.alt || title),
      logo: String(body.logo || ""),
      sortOrder: Number(body.sortOrder) || 0,
      isActive: body.isActive !== false,
    },
    { new: true },
  ).lean();
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateSiteCache();
  return NextResponse.json(withId(deal));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const result = await DealBanner.findByIdAndDelete(oid);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateSiteCache();
  return NextResponse.json({ ok: true });
}
