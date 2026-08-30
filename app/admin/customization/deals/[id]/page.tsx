import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { DealBanner } from "@/lib/models";
import { asObjectId, withId } from "@/lib/serialize";
import { DealBannerForm } from "@/components/customization/deal-banner-form";

export default async function EditDealBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) notFound();
  const deal = await DealBanner.findById(oid).lean();
  if (!deal) notFound();
  const row = withId(deal)!;

  return (
    <div className="space-y-3">
      <p className="caption mb-2">
        <Link href="/admin/customization" className="hover:text-ink">
          Customization
        </Link>{" "}
        →{" "}
        <Link href="/admin/customization/deals" className="hover:text-ink">
          Deals
        </Link>{" "}
        → Edit
      </p>
      <h1 className="display-sm text-ink m-0 !text-[28px]">Edit deal banner</h1>
      <DealBannerForm
        initial={{
          id: row.id,
          title: String(row.title),
          description: String(row.description),
          ctaLabel: String(row.ctaLabel),
          href: String(row.href),
          image: String(row.image),
          alt: String(row.alt),
          logo: String(row.logo || ""),
          sortOrder: Number(row.sortOrder) || 0,
          isActive: Boolean(row.isActive),
        }}
      />
    </div>
  );
}
