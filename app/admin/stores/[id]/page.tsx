import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Merchant } from "@/lib/models";
import { asObjectId, withId } from "@/lib/serialize";
import { StoreForm } from "@/components/store-form";

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) notFound();
  const store = await Merchant.findById(oid).lean();
  if (!store) notFound();
  const row = withId(store)!;

  return (
    <div className="space-y-3">
      <h1 className="display-sm text-ink m-0 !text-[28px]">Edit store</h1>
      <StoreForm
        initial={{
          id: row.id,
          name: row.name as string,
          slug: row.slug as string,
          logo: row.logo as string,
          websiteUrl: row.websiteUrl as string,
          description: row.description as string,
          seoTitle: row.seoTitle as string,
          seoDescription: row.seoDescription as string,
          isActive: row.isActive as boolean,
          isFeatured: row.isFeatured as boolean,
        }}
      />
    </div>
  );
}
