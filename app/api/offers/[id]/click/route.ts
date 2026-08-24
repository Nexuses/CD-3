import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Offer } from "@/lib/models";
import { asObjectId } from "@/lib/serialize";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const oid = asObjectId(id);
  if (!oid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await connectDB();
  const offer = await Offer.findByIdAndUpdate(
    oid,
    { $inc: { clickCount: 1 } },
    { new: true, select: "_id clickCount" },
  ).lean();
  if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ id: String(offer._id), clickCount: offer.clickCount });
}
