import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StoreForm } from "@/components/store-form";

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = Number((await params).id);
  const store = await prisma.merchant.findUnique({ where: { id } });
  if (!store) notFound();

  return (
    <div className="space-y-3">
      <h1 className="display-sm text-ink m-0 !text-[28px]">Edit store</h1>
      <StoreForm initial={store} />
    </div>
  );
}
