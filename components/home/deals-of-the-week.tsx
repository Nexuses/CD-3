import Link from "next/link";
import type { DealBanner } from "@/lib/home-banners";

export function DealsOfTheWeek({ deals }: { deals: DealBanner[] }) {
  return (
    <section className="bg-white border-b border-hairline-soft">
      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-10">
        <div className="mb-5">
          <p className="eyebrow mb-1">Hot deals</p>
          <h2 className="display-sm text-ink m-0" style={{ fontSize: 28 }}>
            Deals of the Week
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          {deals.map((d) => (
            <Link
              key={d.id}
              href={d.href}
              className="group relative overflow-hidden rounded-2xl border border-hairline bg-[#0b1220] min-h-[200px] md:min-h-[240px]"
            >
              <img
                src={d.image}
                alt={d.alt}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
              <div className="relative z-10 flex h-full min-h-[200px] flex-col justify-end gap-2 p-5 md:min-h-[240px] md:p-7">
                <h3 className="m-0 text-xl font-semibold leading-tight text-white md:text-2xl">
                  {d.title}
                </h3>
                <p className="m-0 text-sm text-white/85">{d.description}</p>
                <span className="mt-2 inline-flex h-10 w-fit items-center rounded-md bg-fin-orange px-4 text-sm font-semibold text-white">
                  {d.ctaLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
