"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ButtonPrimary, ButtonSecondary } from "./ui";
import type { OfferWithRelations } from "@/lib/utils";

type ModalOffer = Pick<
  OfferWithRelations,
  | "id"
  | "type"
  | "title"
  | "couponCode"
  | "affiliateUrl"
  | "discountLabel"
  | "isExclusive"
  | "merchant"
>;

export function OfferModal({
  offer,
  onClose,
}: {
  offer: ModalOffer | null;
  onClose: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setRevealed(false);
    setCopied(false);
    if (offer) {
      document.body.style.overflow = "hidden";
      fetch(`/api/offers/${offer.id}/click`, { method: "POST" }).catch(() => {});
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [offer]);

  if (!mounted || !offer) return null;

  const isCoupon = offer.type === "coupon";
  const showCode = isCoupon && (!offer.isExclusive || revealed);

  async function copyCode() {
    if (!offer?.couponCode) return;
    try {
      await navigator.clipboard.writeText(offer.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-canvas/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-surface-1 border border-hairline overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline-soft">
          <span className="eyebrow text-ink-muted">Clicks 4 Coupon</span>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-subtle hover:text-ink text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="logo-tile w-12 h-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={offer.merchant.logo}
                alt=""
                className="w-full h-full"
              />
            </div>
            <div>
              <p className="caption m-0">{offer.merchant.name}</p>
              <h3 id="offer-modal-title" className="title-md text-ink m-0">
                {offer.title}
              </h3>
            </div>
          </div>

          {offer.discountLabel && (
            <span className="inline-flex rounded-sm bg-surface-2 caption-strong px-2.5 py-1 text-ink">
              {offer.discountLabel}
            </span>
          )}

          {isCoupon ? (
            <>
              {showCode ? (
                <div className="flex items-center justify-between gap-3 rounded-md border border-hairline bg-canvas px-4 py-3">
                  <code className="number-display text-ink tracking-wider">
                    {offer.couponCode}
                  </code>
                  <ButtonSecondary type="button" onClick={copyCode} className="!h-9 !text-sm shrink-0">
                    {copied ? "Copied!" : "Copy"}
                  </ButtonSecondary>
                </div>
              ) : (
                <div className="text-center space-y-3 py-2">
                  <p className="body-sm m-0">Exclusive offer — reveal your code to continue.</p>
                  <div className="rounded-md border border-hairline bg-canvas px-4 py-3 number-display text-ink-muted tracking-wider">
                    ******
                  </div>
                  <ButtonPrimary type="button" onClick={() => setRevealed(true)}>
                    Reveal code
                  </ButtonPrimary>
                </div>
              )}
              <p className="caption text-center m-0">
                Copy the code, then visit the store and paste at checkout.
              </p>
              <a href={offer.affiliateUrl} target="_blank" rel="noopener noreferrer" className="block">
                <ButtonPrimary type="button" className="w-full">
                  Visit store
                </ButtonPrimary>
              </a>
            </>
          ) : (
            <>
              <p className="body-sm text-center py-2 m-0">
                Deal activated. No coupon code required.
              </p>
              <a href={offer.affiliateUrl} target="_blank" rel="noopener noreferrer" className="block">
                <ButtonPrimary type="button" className="w-full" size="lg">
                  Go to website
                </ButtonPrimary>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
