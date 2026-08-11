import Link from "next/link";
import type { RecommendedCard } from "@/lib/home-banners";

export function RecommendedNewLaunch({ cards }: { cards: RecommendedCard[] }) {
  return (
    <section className="bg-canvas border-b border-hairline-soft">
      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-10">
        <div className="mb-2">
          <p className="eyebrow mb-1">Recommended</p>
          <h2 className="display-sm text-ink m-0" style={{ fontSize: 28 }}>
            New Launch Coupons
          </h2>
        </div>
        <p className="body-md max-w-2xl mb-6">
          Discover the latest coupons &amp; cashback deals — perfect for gamers, fashion lovers,
          and lifestyle shoppers.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {cards.map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className="group overflow-hidden rounded-xl border border-hairline bg-surface-1 transition hover:border-ink/40"
            >
              <div className="aspect-[3/2] bg-surface-2 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-3 md:p-4">
                <h3 className="title-sm text-ink m-0" style={{ fontSize: 16 }}>
                  {c.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
