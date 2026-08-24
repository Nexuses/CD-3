import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Category, Merchant } from "@/lib/models";
import { mapId } from "@/lib/serialize";
import { OfferForm } from "@/components/offer-form";

export default async function NewOfferPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await connectDB();
  const [merchants, categories] = await Promise.all([
    Merchant.find().sort({ name: "asc" }).select("name").lean(),
    Category.find().sort({ name: "asc" }).select("name").lean(),
  ]);

  if (merchants.length === 0) {
    redirect("/admin/stores/new");
  }

  return (
    <div className="space-y-3">
      <h1 className="display-sm text-ink m-0 !text-[28px]">Add Offer</h1>
      <OfferForm
        merchants={mapId(merchants).map((m) => ({ id: m.id, name: m.name as string }))}
        categories={mapId(categories).map((c) => ({ id: c.id, name: c.name as string }))}
      />
    </div>
  );
}
