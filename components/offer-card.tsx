"use client";

import { useState } from "react";
import Link from "next/link";
import { OfferModal } from "./offer-modal";
import { ButtonPrimary, ButtonAccent, ButtonTertiary } from "./ui";
import { BrandLogo } from "./store-tile";
import { usedTodayFromClicks, type OfferWithRelations } from "@/lib/utils";

export function OfferCard({ offer }: { offer: OfferWithRelations }) {
  const [open, setOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const used = usedTodayFromClicks(offer.clickCount);
  const isCoupon = offer.type === "coupon";
  const Cta = offer.isExclusive ? ButtonAccent : ButtonPrimary;

  return (
    <>
      <article
        id={`offer-${offer.id}`}
        className="rounded-lg border border-hairline bg-surface-1 p-5 md:p-6 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex sm:flex-col items-center gap-2 sm:w-20 shrink-0">
            <Link href={`/${offer.merchant.slug}`}>
              <BrandLogo src={offer.merchant.logo} name={offer.merchant.name} size={48} />
            </Link>
            <span className="caption text-center">{offer.merchant.name}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {offer.discountLabel && (
                <span className="caption-strong rounded-sm bg-surface-2 px-2.5 py-1 text-ink">
                  {offer.discountLabel}
                </span>
              )}
              {offer.isExclusive && (
                <span className="caption-strong rounded-sm bg-fin-orange/10 text-fin-orange px-2.5 py-1">
                  Exclusive
                </span>
              )}
              <span className="caption ml-auto">
                <span className="text-semantic-up font-medium">{used}</span> used today
              </span>
            </div>
            <h3 className="title-sm text-ink m-0 mb-1" style={{ fontSize: 18 }}>
              {offer.title}
            </h3>
            {offer.subtitle && (
              <p className="body-sm m-0 mb-3 line-clamp-2">{offer.subtitle}</p>
            )}
            {isCoupon && offer.couponCode && (
              <div className="inline-block rounded-md border border-dashed border-hairline bg-canvas px-3 py-1.5 number-display text-ink-muted mb-2 tracking-wider">
                {offer.isExclusive ? "******" : `${offer.couponCode.slice(0, 2)}****`}
              </div>
            )}
            {offer.terms && (
              <div>
                <ButtonTertiary
                  type="button"
                  className="!text-sm !px-0 !py-1"
                  onClick={() => setShowTerms(!showTerms)}
                >
                  {showTerms ? "Hide details" : "Show details"}
                </ButtonTertiary>
                {showTerms && (
                  <p className="caption mt-2 mb-0 whitespace-pre-line">{offer.terms}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex sm:flex-col items-center justify-center shrink-0">
            <Cta type="button" onClick={() => setOpen(true)} className="whitespace-nowrap">
              {isCoupon ? "Get coupon" : "Get deal"}
            </Cta>
          </div>
        </div>
      </article>
      <OfferModal offer={open ? offer : null} onClose={() => setOpen(false)} />
    </>
  );
}

export function OfferCardCompact({ offer }: { offer: OfferWithRelations }) {
  const [open, setOpen] = useState(false);
  const isCoupon = offer.type === "coupon";
  const Cta = offer.isExclusive ? ButtonAccent : ButtonPrimary;

  return (
    <>
      <article className="rounded-lg border border-hairline bg-surface-1 p-5 flex flex-col h-full min-w-[220px]">
        <div className="flex items-center gap-3 mb-3">
          <BrandLogo src={offer.merchant.logo} name={offer.merchant.name} size={40} />
          <span className="caption truncate">{offer.merchant.name}</span>
        </div>
        {offer.discountLabel && (
          <span className="self-start caption-strong rounded-sm bg-surface-2 px-2.5 py-1 mb-2 text-ink">
            {offer.discountLabel}
          </span>
        )}
        {offer.isExclusive && (
          <span className="self-start caption-strong rounded-sm bg-fin-orange/10 text-fin-orange px-2.5 py-1 mb-2">
            Exclusive
          </span>
        )}
        <h3 className="title-sm text-ink flex-1 mb-4 line-clamp-2">{offer.title}</h3>
        <Cta type="button" onClick={() => setOpen(true)} className="w-full">
          {isCoupon ? "Get coupon" : "Get deal"}
        </Cta>
      </article>
      <OfferModal offer={open ? offer : null} onClose={() => setOpen(false)} />
    </>
  );
}
