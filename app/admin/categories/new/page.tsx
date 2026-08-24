import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models";
import { mapId } from "@/lib/serialize";
import { CategoryForm } from "@/components/category-form";

export default async function NewCategoryPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  await connectDB();
  const parents = mapId(
    await Category.find().sort({ name: 1 }).select("name").lean(),
  ).map((p) => ({ id: p.id, name: p.name as string }));
  return (
    <div className="space-y-3">
      <h1 className="display-sm text-ink m-0 !text-[28px]">Add Category</h1>
      <CategoryForm parents={parents} />
    </div>
  );
}
