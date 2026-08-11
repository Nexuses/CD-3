import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      parent: { select: { name: true } },
      _count: { select: { offers: true } },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  let slug = String(body.slug || slugify(name)).trim() || slugify(name);
  if (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }
  const parentId = body.parentId ? Number(body.parentId) : null;
  const category = await prisma.category.create({
    data: { name, slug, parentId },
  });
  return NextResponse.json(category, { status: 201 });
}
