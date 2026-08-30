import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Category, Offer } from "@/lib/models";
import { searchSite } from "@/lib/search";
import { getStoresDirectoryData } from "@/lib/site-data";
import { OfferCard } from "@/components/offer-card";
import { StoreTile } from "@/components/store-tile";
import { BadgePill, ButtonPrimary, FeatureCard } from "@/components/ui";

export const metadata = {
  title: "All Stores Coupons & Offers",
};

export const revalidate = 300;

const LETTERS = ["ALL", "#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

function readQueryParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export default async function StoresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; letter?: string; category?: string; bank?: string }>;
}) {
  const sp = await searchParams;
  const q = readQueryParam(sp.q).trim();
  const letter = (sp.letter || "ALL").toUpperCase();
  const categorySlug = sp.category || "";
  const bank = sp.bank || "";
  const isSearch = q.length > 0;

  let categories: Awaited<ReturnType<typeof getStoresDirectoryData>>["categories"];
  let merchants: Awaited<ReturnType<typeof getStoresDirectoryData>>["merchants"];
  let searchOffers: Awaited<ReturnType<typeof searchSite>>["offers"] = [];
  let searchCategories: Awaited<ReturnType<typeof searchSite>>["categories"] = [];

  if (isSearch) {
    const results = await searchSite(q);
    merchants = results.merchants;
    searchCategories = results.categories;
    searchOffers = results.offers;
    const directory = await getStoresDirectoryData();
    categories = directory.categories;
  } else if (categorySlug || bank) {
    await connectDB();
    const directory = await getStoresDirectoryData();
    categories = directory.categories;

    const offerFilter: Record<string, unknown> = { isActive: true };
    if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug }).select("_id").lean();
      if (cat) offerFilter.categoryIds = cat._id;
    }
    if (bank) offerFilter.bankTags = bank;

    const merchantIds = await Offer.distinct("merchantId", offerFilter);
    const allowed = new Set(merchantIds.map((id) => String(id)));
    merchants = directory.merchants.filter((m) => allowed.has(m.id));
  } else {
    ({ categories, merchants } = await getStoresDirectoryData());
  }

  const filtered = isSearch
    ? merchants
    : merchants.filter((m) => {
        if (letter === "ALL") return true;
        const first = String(m.name).charAt(0).toUpperCase();
        if (letter === "#") return !/[A-Z]/.test(first);
        return first === letter;
      });

  const grouped = new Map<string, typeof filtered>();
  for (const m of filtered) {
    const key = /[A-Z]/i.test(String(m.name).charAt(0))
      ? String(m.name).charAt(0).toUpperCase()
      : "#";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(m);
  }

  const hasSearchResults =
    isSearch && (searchCategories.length > 0 || filtered.length > 0 || searchOffers.length > 0);

  function href(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const next = {
      q: q || undefined,
      letter: !isSearch && letter !== "ALL" ? letter : undefined,
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
      <h1 className="display-sm text-ink m-0 mb-2">
        {isSearch ? "Search results" : "All stores"}
      </h1>
      <p className="body-md mb-8 max-w-xl">
        {isSearch
          ? "Stores, categories, and offers matching your search."
          : "Browse coupons and deals alphabetically or filter by category."}
      </p>

      {isSearch && (
        <p className="body-sm mb-4">
          Showing results for <strong className="text-ink">&ldquo;{q}&rdquo;</strong>.{" "}
          <Link href="/stores" className="text-fin-orange font-medium">
            Clear search
          </Link>
        </p>
      )}

      {bank && !isSearch && (
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
                      category: categorySlug === c.slug ? undefined : (c.slug as string),
                    })}
                    className={`flex items-center gap-2 text-sm px-2 py-2 rounded-md ${
                      categorySlug === c.slug
                        ? "bg-fin-orange/10 text-fin-orange font-medium"
                        : "text-ink-muted hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    {c.name as string}
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
          {!isSearch && (
            <div className="flex flex-wrap gap-1.5">
              {LETTERS.map((L) => (
                <Link
                  key={L}
                  href={href({ letter: L === "ALL" ? undefined : L })}
                  className={`caption-strong px-2.5 py-1.5 rounded-md ${
                    letter === L
                      ? "bg-ink !text-white"
                      : "bg-surface-2 text-ink hover:bg-hairline"
                  }`}
                >
                  {L}
                </Link>
              ))}
            </div>
          )}

          <form action="/stores" method="get" className="flex gap-2">
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            {bank && <input type="hidden" name="bank" value={bank} />}
            <input
              name="q"
              defaultValue={q}
              placeholder="Search stores, categories, or offers…"
              className="flex-1 h-12 px-3.5 text-sm bg-surface-1 border border-hairline rounded-md outline-none focus:border-ink"
            />
            <ButtonPrimary type="submit">Search</ButtonPrimary>
          </form>

          {isSearch ? (
            !hasSearchResults ? (
              <FeatureCard className="text-center py-12">
                <p className="body-md m-0">No stores, categories, or offers matched your search.</p>
              </FeatureCard>
            ) : (
              <div className="space-y-10">
                {searchCategories.length > 0 && (
                  <section>
                    <h2 className="title-md text-ink mb-4">Categories</h2>
                    <div className="flex flex-wrap gap-2">
                      {searchCategories.map((c) => (
                        <Link
                          key={c.id}
                          href={`/category/${c.slug}`}
                          className="nav-link rounded-md bg-surface-1 border border-hairline px-4 py-2.5 text-ink hover:border-ink"
                        >
                          {c.name as string}
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {filtered.length > 0 && (
                  <section>
                    <h2 className="title-md text-ink mb-4">Stores</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filtered.map((m) => {
                        const coupons = m.offers.filter((o) => o.type === "coupon").length;
                        const deals = m.offers.filter((o) => o.type === "deal").length;
                        return (
                          <StoreTile
                            key={m.id}
                            slug={m.slug as string}
                            name={m.name as string}
                            logo={m.logo as string}
                            offerCount={m.offers.length}
                            couponCount={coupons}
                            dealCount={deals}
                          />
                        );
                      })}
                    </div>
                  </section>
                )}

                {searchOffers.length > 0 && (
                  <section>
                    <h2 className="title-md text-ink mb-4">Offers</h2>
                    <div className="space-y-4">
                      {searchOffers.map((offer) => (
                        <OfferCard key={offer.id} offer={offer} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )
          ) : filtered.length === 0 ? (
            <FeatureCard className="text-center py-12">
              <p className="body-md m-0">No stores found for your filters.</p>
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
                          slug={m.slug as string}
                          name={m.name as string}
                          logo={m.logo as string}
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
