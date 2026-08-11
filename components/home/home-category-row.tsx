import Link from "next/link";
import type { HomeCategory } from "@/lib/home-banners";

export function HomeCategoryRow({ categories }: { categories: HomeCategory[] }) {
  return (
    <section className="bg-white border-b border-hairline-soft">
      <div className="max-w-[1280px] mx-auto px-4 py-6 md:py-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow mb-1">Browse</p>
            <h2 className="display-sm text-ink m-0" style={{ fontSize: 28 }}>
              Categories
            </h2>
          </div>
          <Link href="/stores" className="btn-label text-fin-orange shrink-0">
            Shop all →
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 md:gap-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className="group flex w-[88px] shrink-0 flex-col items-center gap-2 text-center sm:w-[100px]"
            >
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-surface-2 ring-1 ring-hairline-soft transition group-hover:ring-ink/30 sm:h-[72px] sm:w-[72px]">
                <img src={c.image} alt="" className="h-full w-full object-cover" />
              </span>
              <span className="caption text-ink leading-snug group-hover:text-fin-orange">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
