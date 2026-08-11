import Link from "next/link";

export function OfferTabs({
  basePath,
  active,
  counts,
}: {
  basePath: string;
  active: string;
  counts: { all: number; coupon: number; deal: number };
}) {
  const tabs = [
    { key: "all", label: "All", count: counts.all, href: basePath },
    {
      key: "coupon",
      label: "Coupons",
      count: counts.coupon,
      href: `${basePath}?type=coupon`,
    },
    {
      key: "deal",
      label: "Deals",
      count: counts.deal,
      href: `${basePath}?type=deal`,
    },
  ];

  return (
    <div className="inline-flex flex-wrap gap-1 p-1 rounded-full bg-canvas border border-hairline">
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <Link
            key={t.key}
            href={t.href}
            className={`nav-link rounded-full px-4 py-2 ${
              isActive
                ? "bg-surface-1 text-ink border border-hairline"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {t.label}{" "}
            <span className={`text-sm ${isActive ? "text-ink-subtle" : "text-ink-tertiary"}`}>
              ({t.count})
            </span>
          </Link>
        );
      })}
    </div>
  );
}
