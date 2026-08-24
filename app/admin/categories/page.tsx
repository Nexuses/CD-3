import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models";
import { offerCountsByCategory } from "@/lib/db-helpers";
import { mapId } from "@/lib/serialize";
import { FeatureCard, ButtonPrimary } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";

export default async function AdminCategoriesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await connectDB();
  const [categoryDocs, offerCounts] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    offerCountsByCategory(),
  ]);
  const parentIds = categoryDocs.map((c) => c.parentId).filter(Boolean);
  const parents = await Category.find({ _id: { $in: parentIds } })
    .select("name")
    .lean();
  const parentMap = new Map(parents.map((p) => [String(p._id), p.name]));
  const categories = mapId(categoryDocs).map((c) => ({
    ...c,
    parent: c.parentId ? { name: parentMap.get(c.parentId) || "" } : null,
    _count: { offers: offerCounts.get(c.id) || 0 },
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="display-sm text-ink m-0 !text-[28px]">Categories</h1>
        <Link href="/admin/categories/new">
          <ButtonPrimary type="button">+ Add category</ButtonPrimary>
        </Link>
      </div>
      <FeatureCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-soft caption-strong text-muted">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Parent</th>
                <th className="p-4">Offers</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t border-hairline">
                  <td className="p-4 font-semibold text-ink">{c.name}</td>
                  <td className="p-4 text-muted">{c.slug}</td>
                  <td className="p-4">{c.parent?.name || "—"}</td>
                  <td className="p-4 number-display text-sm">{c._count.offers}</td>
                  <td className="p-4 space-x-3">
                    <Link href={`/admin/categories/${c.id}`} className="text-primary font-semibold">
                      Edit
                    </Link>
                    <DeleteButton endpoint={`/api/admin/categories/${c.id}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FeatureCard>
    </div>
  );
}
