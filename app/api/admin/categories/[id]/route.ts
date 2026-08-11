import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  let slug = String(body.slug || slugify(name)).trim();
  const clash = await prisma.category.findFirst({ where: { slug, NOT: { id } } });
  if (clash) slug = `${slug}-${id}`;
  const parentId = body.parentId ? Number(body.parentId) : null;
  if (parentId === id) {
    return NextResponse.json({ error: "Cannot be own parent" }, { status: 400 });
  }
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, parentId },
    });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
