import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FeatureCard, ButtonPrimary } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";

export default async function AdminStoresPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const stores = await prisma.merchant.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { offers: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="display-sm text-ink m-0 !text-[28px]">Stores</h1>
        <Link href="/admin/stores/new">
          <ButtonPrimary type="button">+ Add store</ButtonPrimary>
        </Link>
      </div>
      <FeatureCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-soft caption-strong text-muted">
              <tr>
                <th className="p-4">Logo</th>
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Offers</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id} className="border-t border-hairline">
                  <td className="p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.logo} alt="" className="w-8 h-8 rounded-full" />
                  </td>
                  <td className="p-4 font-semibold text-ink">{s.name}</td>
                  <td className="p-4 text-muted">{s.slug}</td>
                  <td className="p-4 number-display text-sm">{s._count.offers}</td>
                  <td className="p-4">
                    <span
                      className={`caption-strong rounded-full px-2.5 py-1 ${
                        s.isActive ? "bg-primary/10 text-primary" : "bg-surface-strong text-muted"
                      }`}
                    >
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 space-x-3 whitespace-nowrap">
                    <Link href={`/admin/stores/${s.id}`} className="text-primary font-semibold">
                      Edit
                    </Link>
                    <Link href={`/${s.slug}`} className="text-muted font-semibold" target="_blank">
                      View
                    </Link>
                    <DeleteButton endpoint={`/api/admin/stores/${s.id}`} />
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
