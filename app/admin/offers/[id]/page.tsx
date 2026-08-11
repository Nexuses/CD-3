import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OfferForm } from "@/components/offer-form";

export default async function EditOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = Number((await params).id);

  const [offer, merchants, categories] = await Promise.all([
    prisma.offer.findUnique({
      where: { id },
      include: { categories: true, bankTags: true },
    }),
    prisma.merchant.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!offer) notFound();

  const expiryDate = offer.expiryDate
    ? offer.expiryDate.toISOString().slice(0, 10)
    : null;

  return (
    <div className="space-y-3">
      <h1 className="display-sm text-ink m-0 !text-[28px]">Edit offer</h1>
      <OfferForm
        merchants={merchants}
        categories={categories}
        initial={{
          id: offer.id,
          merchantId: offer.merchantId,
          type: offer.type,
          title: offer.title,
          subtitle: offer.subtitle,
          terms: offer.terms,
          couponCode: offer.couponCode,
          affiliateUrl: offer.affiliateUrl,
          discountLabel: offer.discountLabel,
          isExclusive: offer.isExclusive,
          expiryDate,
          isActive: offer.isActive,
          categoryIds: offer.categories.map((c) => c.categoryId),
          bankTags: offer.bankTags.map((b) => b.tagName),
        }}
      />
    </div>
  );
}
