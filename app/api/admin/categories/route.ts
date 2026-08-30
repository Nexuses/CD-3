import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models";
import { offerCountsByCategory } from "@/lib/db-helpers";
import { mapId, withId } from "@/lib/serialize";
import { slugify } from "@/lib/utils";
import { revalidateSiteCache } from "@/lib/revalidate-site";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const [categories, offerCounts] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    offerCountsByCategory(),
  ]);
  const parentIds = categories.map((c) => c.parentId).filter(Boolean);
  const parents = await Category.find({ _id: { $in: parentIds } })
    .select("name")
    .lean();
  const parentMap = new Map(parents.map((p) => [String(p._id), p.name]));

  return NextResponse.json(
    mapId(categories).map((c) => ({
      ...c,
      parent: c.parentId ? { name: parentMap.get(c.parentId) || "" } : null,
      _count: { offers: offerCounts.get(c.id) || 0 },
    })),
  );
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  let slug = String(body.slug || slugify(name)).trim() || slugify(name);
  if (await Category.findOne({ slug })) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }
  const parentId = body.parentId ? String(body.parentId) : null;
  const category = await Category.create({ name, slug, parentId });
  revalidateSiteCache();
  return NextResponse.json(withId(category.toObject()), { status: 201 });
}
