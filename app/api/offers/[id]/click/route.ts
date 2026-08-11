import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const offerId = Number(id);
  if (!Number.isFinite(offerId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const offer = await prisma.offer.update({
      where: { id: offerId },
      data: { clickCount: { increment: 1 } },
      select: { id: true, clickCount: true },
    });
    return NextResponse.json(offer);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
