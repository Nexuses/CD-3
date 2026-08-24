import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models";
import { asObjectId, withId } from "@/lib/serialize";
import { slugify } from "@/lib/utils";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const id = (await params).id;
  const oid = asObjectId(id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  let slug = String(body.slug || slugify(name)).trim();
  const clash = await Category.findOne({ slug, _id: { $ne: oid } });
  if (clash) slug = `${slug}-${id.slice(-6)}`;
  const parentId = body.parentId ? String(body.parentId) : null;
  if (parentId === id) {
    return NextResponse.json({ error: "Cannot be own parent" }, { status: 400 });
  }

  const category = await Category.findByIdAndUpdate(
    oid,
    { name, slug, parentId },
    { new: true },
  ).lean();
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(withId(category));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const result = await Category.findByIdAndDelete(oid);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
