import Link from "next/link";
import type { SpotlightCoupon } from "@/lib/home-banners";

export function FeaturedSpotlight({ coupons }: { coupons: SpotlightCoupon[] }) {
  return (
    <section className="bg-canvas border-b border-hairline-soft">
      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-10">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow mb-1">Featured</p>
            <h2 className="display-sm text-ink m-0" style={{ fontSize: 28 }}>
              Spotlight Coupons
            </h2>
          </div>
          <Link href="/stores" className="btn-label text-fin-orange shrink-0">
            View all →
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {coupons.map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className="group w-[180px] shrink-0 overflow-hidden rounded-xl border border-hairline bg-surface-1 transition hover:border-ink/40 sm:w-[200px]"
            >
              <div className="aspect-[3/2] bg-surface-2 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-3">
                <p className="caption text-fin-orange m-0 mb-1">{c.subtitle}</p>
                <h3 className="title-sm text-ink m-0" style={{ fontSize: 15 }}>
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
