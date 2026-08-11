import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OfferForm } from "@/components/offer-form";

export default async function NewOfferPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [merchants, categories] = await Promise.all([
    prisma.merchant.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (merchants.length === 0) {
    redirect("/admin/stores/new");
  }

  return (
    <div className="space-y-3">
      <h1 className="display-sm text-ink m-0 !text-[28px]">Add Offer</h1>
      <OfferForm merchants={merchants} categories={categories} />
    </div>
  );
}
