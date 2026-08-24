import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models";
import { asObjectId, mapId, withId } from "@/lib/serialize";
import { CategoryForm } from "@/components/category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) notFound();
  const category = await Category.findById(oid).lean();
  if (!category) notFound();
  const parents = mapId(
    await Category.find().sort({ name: 1 }).select("name").lean(),
  ).map((p) => ({ id: p.id, name: p.name as string }));
  const row = withId(category)!;
  return (
    <div className="space-y-3">
      <h1 className="display-sm text-ink m-0 !text-[28px]">Edit category</h1>
      <CategoryForm
        initial={{
          id: row.id,
          name: row.name as string,
          slug: row.slug as string,
          parentId: (row.parentId as string | null) || null,
        }}
        parents={parents}
      />
    </div>
  );
}
