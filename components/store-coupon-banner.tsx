"use client";

import { useEffect, useState } from "react";
import { OfferModal } from "@/components/offer-modal";
import type { OfferWithRelations } from "@/lib/utils";

const BANNER_IMAGES = [
  "/images/home/hero/amazon.png",
  "/images/home/deals/travel.jpg",
  "/images/home/hero/air-india.png",
  "/images/home/deals/jewellery.png",
  "/images/home/hero/bgmi.png",
];

export type StoreBannerOffer = Pick<
  OfferWithRelations,
  | "id"
  | "type"
  | "title"
  | "subtitle"
  | "couponCode"
  | "affiliateUrl"
  | "discountLabel"
  | "isExclusive"
  | "merchant"
>;

export function StoreCouponBanner({
  storeName,
  offers,
}: {
  storeName: string;
  offers: StoreBannerOffer[];
}) {
  const slides = offers.slice(0, 3);
  const [index, setIndex] = useState(0);
  const [activeOffer, setActiveOffer] = useState<StoreBannerOffer | null>(null);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 5000);
    return () => window.clearInterval(id);
  }, [count]);

  if (!count) return null;

  function openOffer(offer: StoreBannerOffer) {
    const el = document.getElementById(`offer-${offer.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setActiveOffer(offer);
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-hairline min-h-[240px] md:min-h-[300px]">
        {slides.map((offer, i) => {
          const bg = BANNER_IMAGES[i % BANNER_IMAGES.length];
          const active = i === index;
          return (
            <button
              key={offer.id}
              type="button"
              onClick={() => openOffer(offer)}
              className={`absolute inset-0 text-left transition-opacity duration-500 ${
                active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!active}
              aria-label={`${offer.discountLabel || "Offer"}: ${offer.title}`}
            >
              <img
                src={bg}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />
              <div className="relative z-10 flex h-full flex-col justify-center gap-3 p-6 md:p-10 max-w-xl">
                <p className="eyebrow m-0 text-white/80">{storeName}</p>
                {offer.discountLabel && (
                  <span className="self-start rounded-sm bg-fin-orange px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {offer.discountLabel}
                  </span>
                )}
                <h2 className="m-0 text-2xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
                  {offer.title}
                </h2>
                {offer.subtitle && (
                  <p className="m-0 text-sm text-white/85 md:text-base line-clamp-2">
                    {offer.subtitle}
                  </p>
                )}
                <span className="mt-1 inline-flex h-11 w-fit items-center rounded-md bg-white px-5 text-sm font-semibold text-ink">
                  {offer.type === "coupon" ? "Get coupon" : "Get deal"}
                </span>
              </div>
            </button>
          );
        })}

        {/* Height reserve */}
        <div className="invisible pointer-events-none select-none p-6 md:p-10 max-w-xl">
          <p className="eyebrow m-0">{storeName}</p>
          <div className="mt-3 h-6" />
          <h2 className="m-0 text-2xl font-semibold md:text-4xl">{slides[index].title}</h2>
          {slides[index].subtitle && (
            <p className="mt-3 text-sm md:text-base">{slides[index].subtitle}</p>
          )}
          <div className="mt-4 h-11" />
        </div>

        {count > 1 && (
          <div className="absolute bottom-4 left-6 z-20 flex gap-2 md:left-10">
            {slides.map((offer, i) => (
              <button
                key={offer.id}
                type="button"
                aria-label={`Show coupon ${i + 1}`}
                aria-current={i === index}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2.5 bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      <OfferModal offer={activeOffer} onClose={() => setActiveOffer(null)} />
    </>
  );
}
