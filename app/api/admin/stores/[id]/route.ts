import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function guard() {
  return getSession();
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  const store = await prisma.merchant.findUnique({ where: { id } });
  if (!store) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(store);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  let slug = String(body.slug || slugify(name)).trim();
  const clash = await prisma.merchant.findFirst({
    where: { slug, NOT: { id } },
  });
  if (clash) slug = `${slug}-${id}`;

  try {
    const store = await prisma.merchant.update({
      where: { id },
      data: {
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
    });
    return NextResponse.json(store);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  try {
    await prisma.merchant.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
