import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FeatureCard, ButtonPrimary } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";

export default async function AdminOffersPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string; type?: string; status?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const sp = await searchParams;

  const merchants = await prisma.merchant.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const offers = await prisma.offer.findMany({
    where: {
      ...(sp.store ? { merchantId: Number(sp.store) } : {}),
      ...(sp.type === "coupon" || sp.type === "deal" ? { type: sp.type } : {}),
      ...(sp.status === "active" ? { isActive: true } : {}),
      ...(sp.status === "inactive" ? { isActive: false } : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { merchant: { select: { name: true } } },
  });

  function href(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const next = { store: sp.store, type: sp.type, status: sp.status, ...overrides };
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const s = params.toString();
    return s ? `/admin/offers?${s}` : "/admin/offers";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="display-sm text-ink m-0 !text-[28px]">Offers</h1>
        <Link href="/admin/offers/new">
          <ButtonPrimary type="button">+ Add offer</ButtonPrimary>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={href({ store: undefined })}
          className={`nav-link rounded-full px-3 py-1.5 ${!sp.store ? "bg-primary text-on-primary" : "bg-surface-strong"}`}
        >
          All stores
        </Link>
        {merchants.slice(0, 8).map((m) => (
          <Link
            key={m.id}
            href={href({ store: String(m.id) })}
            className={`nav-link rounded-full px-3 py-1.5 ${
              sp.store === String(m.id) ? "bg-primary text-on-primary" : "bg-surface-strong"
            }`}
          >
            {m.name}
          </Link>
        ))}
        <Link
          href={href({ type: undefined })}
          className={`nav-link rounded-full px-3 py-1.5 ${!sp.type ? "bg-ink text-on-dark" : "bg-surface-strong"}`}
        >
          All types
        </Link>
        <Link
          href={href({ type: "coupon" })}
          className={`nav-link rounded-full px-3 py-1.5 ${sp.type === "coupon" ? "bg-ink text-on-dark" : "bg-surface-strong"}`}
        >
          Coupons
        </Link>
        <Link
          href={href({ type: "deal" })}
          className={`nav-link rounded-full px-3 py-1.5 ${sp.type === "deal" ? "bg-ink text-on-dark" : "bg-surface-strong"}`}
        >
          Deals
        </Link>
      </div>

      <FeatureCard className="!p-0 overflow-hidden">
        <div className="px-5 pt-5 pb-2">
          <p className="caption m-0">{offers.length} offers</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-soft caption-strong text-muted">
              <tr>
                <th className="p-4">Store</th>
                <th className="p-4">Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Clicks</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((o) => (
                <tr key={o.id} className="border-t border-hairline">
                  <td className="p-4">{o.merchant.name}</td>
                  <td className="p-4 font-semibold text-ink max-w-[200px] truncate">{o.title}</td>
                  <td className="p-4 capitalize">{o.type}</td>
                  <td className="p-4">{o.discountLabel}</td>
                  <td className="p-4 number-display text-sm">{o.clickCount}</td>
                  <td className="p-4">
                    <span
                      className={`caption-strong rounded-full px-2.5 py-1 ${
                        o.isActive ? "bg-primary/10 text-primary" : "bg-surface-strong text-muted"
                      }`}
                    >
                      {o.isActive ? "Active" : "Off"}
                    </span>
                  </td>
                  <td className="p-4 space-x-3 whitespace-nowrap">
                    <Link href={`/admin/offers/${o.id}`} className="text-primary font-semibold">
                      Edit
                    </Link>
                    <DeleteButton endpoint={`/api/admin/offers/${o.id}`} />
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
