import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Merchant } from "@/lib/models";
import { asObjectId, mapId } from "@/lib/serialize";
import { revalidateSiteCache } from "@/lib/revalidate-site";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const stores = await Merchant.find().sort({ name: 1 }).lean();
  return NextResponse.json(mapId(stores));
}

export async function PATCH(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const items = Array.isArray(body.items) ? body.items : [body];

  for (const item of items) {
    const oid = asObjectId(String(item.id || ""));
    if (!oid) continue;
    await Merchant.findByIdAndUpdate(oid, {
      icon: String(item.icon ?? ""),
      logo: String(item.logo ?? ""),
    });
  }

  const stores = await Merchant.find().sort({ name: 1 }).lean();
  revalidateSiteCache();
  return NextResponse.json(mapId(stores));
}
