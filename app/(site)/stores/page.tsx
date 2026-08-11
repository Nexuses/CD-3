import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StoreTile } from "@/components/store-tile";
import { BadgePill, ButtonPrimary, FeatureCard } from "@/components/ui";

export const metadata = {
  title: "All Stores Coupons & Offers",
};

const LETTERS = ["ALL", "#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

export default async function StoresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; letter?: string; category?: string; bank?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim().toLowerCase();
  const letter = (sp.letter || "ALL").toUpperCase();
  const categorySlug = sp.category || "";
  const bank = sp.bank || "";

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    include: { _count: { select: { offers: true } } },
  });

  const merchants = await prisma.merchant.findMany({
    where: {
      isActive: true,
      ...(q ? { OR: [{ name: { contains: q } }, { slug: { contains: q } }] } : {}),
      ...(categorySlug
        ? {
            offers: {
              some: {
                isActive: true,
                categories: { some: { category: { slug: categorySlug } } },
              },
            },
          }
        : {}),
      ...(bank
        ? {
            offers: {
              some: {
                isActive: true,
                bankTags: { some: { tagName: bank } },
              },
            },
          }
        : {}),
    },
    orderBy: { name: "asc" },
    include: {
      offers: { where: { isActive: true }, select: { type: true } },
    },
  });

  const filtered = merchants.filter((m) => {
    if (letter === "ALL") return true;
    const first = m.name.charAt(0).toUpperCase();
    if (letter === "#") return !/[A-Z]/.test(first);
    return first === letter;
  });

  const grouped = new Map<string, typeof filtered>();
  for (const m of filtered) {
    const key = /[A-Z]/i.test(m.name.charAt(0))
      ? m.name.charAt(0).toUpperCase()
      : "#";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(m);
  }

  function href(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const next = {
      q: sp.q,
      letter: letter === "ALL" ? undefined : letter,
      category: categorySlug || undefined,
      bank: bank || undefined,
      ...overrides,
    };
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const s = params.toString();
    return s ? `/stores?${s}` : "/stores";
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 md:py-16">
      <BadgePill className="mb-3">Directory</BadgePill>
      <h1 className="display-sm text-ink m-0 mb-2">All stores</h1>
      <p className="body-md mb-8 max-w-xl">
        Browse coupons and deals alphabetically or filter by category.
      </p>
      {bank && (
        <p className="body-sm mb-4">
          Showing stores with <strong className="text-ink">{bank}</strong> offers.{" "}
          <Link href="/stores" className="text-fin-orange font-medium">
            Clear
          </Link>
        </p>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-56 shrink-0">
          <FeatureCard className="!p-4 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <h2 className="title-sm m-0">Filters</h2>
              <Link href="/stores" className="caption text-fin-orange">
                Clear
              </Link>
            </div>
            <p className="caption-strong text-muted mb-2">Categories</p>
            <ul className="space-y-1 max-h-80 overflow-auto">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={href({
                      category: categorySlug === c.slug ? undefined : c.slug,
                    })}
                    className={`flex items-center gap-2 text-sm px-2 py-2 rounded-md ${
                      categorySlug === c.slug
                        ? "bg-fin-orange/10 text-fin-orange font-medium"
                        : "text-ink-muted hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    {c.name}
                    <span className="ml-auto number-display text-xs text-muted">
                      {c._count.offers}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </FeatureCard>
        </aside>

        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex flex-wrap gap-1.5">
            {LETTERS.map((L) => (
              <Link
                key={L}
                href={href({ letter: L === "ALL" ? undefined : L })}
                className={`caption-strong px-2.5 py-1.5 rounded-md ${
                  letter === L
                    ? "bg-ink text-on-primary"
                    : "bg-surface-2 text-ink hover:bg-hairline"
                }`}
              >
                {L}
              </Link>
            ))}
          </div>

          <form action="/stores" method="get" className="flex gap-2">
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            {bank && <input type="hidden" name="bank" value={bank} />}
            <input
              name="q"
              defaultValue={sp.q || ""}
              placeholder="Search within stores…"
              className="flex-1 h-12 px-3.5 text-sm bg-surface-1 border border-hairline rounded-md outline-none focus:border-ink"
            />
            <ButtonPrimary type="submit">Search</ButtonPrimary>
          </form>

          {filtered.length === 0 ? (
            <FeatureCard className="text-center py-12">
              <p className="body-md m-0">No stores found for your search.</p>
            </FeatureCard>
          ) : (
            [...grouped.entries()]
              .sort(([a], [b]) => (a === "#" ? -1 : b === "#" ? 1 : a.localeCompare(b)))
              .map(([letterKey, list]) => (
                <div key={letterKey}>
                  <h2 className="title-md text-ink mb-4">{letterKey}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {list.map((m) => {
                      const coupons = m.offers.filter((o) => o.type === "coupon").length;
                      const deals = m.offers.filter((o) => o.type === "deal").length;
                      return (
                        <StoreTile
                          key={m.id}
                          slug={m.slug}
                          name={m.name}
                          logo={m.logo}
                          offerCount={m.offers.length}
                          couponCount={coupons}
                          dealCount={deals}
                        />
                      );
                    })}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
