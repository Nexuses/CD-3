import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = Number((await params).id);
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();
  const parents = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return (
    <div className="space-y-3">
      <h1 className="display-sm text-ink m-0 !text-[28px]">Edit category</h1>
      <CategoryForm initial={category} parents={parents} />
    </div>
  );
}
