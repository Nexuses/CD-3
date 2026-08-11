"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/lib/home-banners";

export function HeroBannerCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 5000);
    return () => window.clearInterval(id);
  }, [count]);

  if (!count) return null;
  const slide = slides[index];

  return (
    <section className="bg-white border-b border-hairline-soft">
      <div className="max-w-[1280px] mx-auto px-4 py-4 md:py-6">
        <div className="relative overflow-hidden rounded-2xl border border-hairline bg-white min-h-[240px] md:min-h-[320px]">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={i !== index}
            >
              <div className="grid h-full md:grid-cols-2">
                {/* Left: white copy panel */}
                <div className="relative z-10 flex flex-col justify-center gap-3 bg-white p-6 md:gap-4 md:p-10">
                  <h2 className="m-0 text-2xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">
                    {s.title}
                  </h2>
                  <p className="m-0 text-sm text-ink-muted md:text-base">{s.description}</p>
                  <div>
                    <Link
                      href={s.href}
                      className="inline-flex h-11 items-center rounded-md bg-fin-orange px-5 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      {s.ctaLabel}
                    </Link>
                  </div>
                </div>

                {/* Right: banner image */}
                <div className="relative hidden min-h-[200px] bg-surface-2 md:block">
                  <img
                    src={s.image}
                    alt={s.alt}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                </div>

                {/* Mobile image strip under copy */}
                <div className="relative h-40 bg-surface-2 md:hidden">
                  <img
                    src={s.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:left-10 md:translate-x-0">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Show slide ${i + 1}: ${s.name}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-ink" : "w-2.5 bg-ink/25 hover:bg-ink/45"
                }`}
              />
            ))}
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous banner"
                onClick={() => setIndex((i) => (i - 1 + count) % count)}
                className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-white/90 text-ink shadow-sm transition hover:bg-white md:flex"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next banner"
                onClick={() => setIndex((i) => (i + 1) % count)}
                className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-white/90 text-ink shadow-sm transition hover:bg-white md:flex"
              >
                ›
              </button>
            </>
          )}

          {/* Keep layout height when absolute slides */}
          <div className="invisible pointer-events-none grid select-none md:grid-cols-2">
            <div className="p-6 md:p-10">
              <h2 className="m-0 text-2xl font-semibold leading-tight md:text-4xl">{slide.title}</h2>
              <p className="mt-3 text-sm md:text-base">{slide.description}</p>
              <div className="mt-4 h-11" />
            </div>
            <div className="min-h-[200px] md:min-h-[320px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
