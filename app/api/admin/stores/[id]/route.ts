import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Merchant } from "@/lib/models";
import { asObjectId, withId } from "@/lib/serialize";
import { slugify } from "@/lib/utils";

async function guard() {
  return getSession();
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const store = await Merchant.findById(oid).lean();
  if (!store) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(withId(store));
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const id = (await params).id;
  const oid = asObjectId(id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  let slug = String(body.slug || slugify(name)).trim();
  const clash = await Merchant.findOne({ slug, _id: { $ne: oid } });
  if (clash) slug = `${slug}-${id.slice(-6)}`;

  const store = await Merchant.findByIdAndUpdate(
    oid,
    {
      name,
      slug,
      logo: String(body.logo || ""),
      websiteUrl: String(body.websiteUrl || ""),
      description: String(body.description || ""),
      seoTitle: String(body.seoTitle || ""),
      seoDescription: String(body.seoDescription || ""),
      isActive: body.isActive !== false,
      isFeatured: Boolean(body.isFeatured),
    },
    { new: true },
  ).lean();
  if (!store) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(withId(store));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const result = await Merchant.findByIdAndDelete(oid);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
