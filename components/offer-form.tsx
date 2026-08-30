"use client";

import { FormEvent, useState } from "react";
import { useAppRouter } from "@/lib/use-app-router";
import Link from "next/link";
import { FeatureCard, ButtonPrimary } from "@/components/ui";

type MerchantOpt = { id: string; name: string };
type CategoryOpt = { id: string; name: string };

type OfferInitial = {
  id?: string;
  merchantId: string;
  type: string;
  title: string;
  subtitle: string;
  terms: string;
  couponCode: string | null;
  affiliateUrl: string;
  discountLabel: string;
  isExclusive: boolean;
  expiryDate: string | null;
  isActive: boolean;
  categoryIds: string[];
  bankTags: string[];
};

const inputCls =
  "mt-1.5 w-full h-12 px-4 text-sm bg-canvas border border-hairline rounded-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function OfferForm({
  initial,
  merchants,
  categories,
}: {
  initial?: OfferInitial;
  merchants: MerchantOpt[];
  categories: CategoryOpt[];
}) {
  const router = useAppRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({
    merchantId: initial?.merchantId?.toString() || merchants[0]?.id?.toString() || "",
    type: initial?.type || "deal",
    title: initial?.title || "",
    subtitle: initial?.subtitle || "",
    terms: initial?.terms || "",
    couponCode: initial?.couponCode || "",
    affiliateUrl: initial?.affiliateUrl || "",
    discountLabel: initial?.discountLabel || "",
    isExclusive: initial?.isExclusive || false,
    expiryDate: initial?.expiryDate || "",
    isActive: initial?.isActive !== false,
    categoryIds: initial?.categoryIds || [],
    bankTags: (initial?.bankTags || []).join(", "),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleCat(id: string) {
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((x) => x !== id)
        : [...f.categoryIds, id],
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        merchantId: form.merchantId,
        type: form.type,
        title: form.title,
        subtitle: form.subtitle,
        terms: form.terms,
        couponCode: form.couponCode,
        affiliateUrl: form.affiliateUrl,
        discountLabel: form.discountLabel,
        isExclusive: form.isExclusive,
        expiryDate: form.expiryDate || null,
        isActive: form.isActive,
        categoryIds: form.categoryIds,
        bankTags: form.bankTags,
      };
      const url = isEdit ? `/api/admin/offers/${initial!.id}` : "/api/admin/offers";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      router.push("/admin/offers");
      router.refresh();
    } catch {
      setError("Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FeatureCard>
      <h2 className="title-md mb-4">{isEdit ? "Edit offer" : "Add offer"}</h2>
      <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
        <label className="block">
          <span className="title-sm">Store</span>
          <select
            value={form.merchantId}
            onChange={(e) => setForm({ ...form, merchantId: e.target.value })}
            className={inputCls}
            required
          >
            {merchants.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="flex gap-6 text-sm font-semibold">
          <legend className="sr-only">Type</legend>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              checked={form.type === "coupon"}
              onChange={() => setForm({ ...form, type: "coupon" })}
            />
            Coupon
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              checked={form.type === "deal"}
              onChange={() => setForm({ ...form, type: "deal" })}
            />
            Deal
          </label>
        </fieldset>

        <label className="block">
          <span className="title-sm">Offer title</span>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputCls}
            required
          />
        </label>
        <label className="block">
          <span className="title-sm">Subtitle</span>
          <input
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className={inputCls}
          />
        </label>
        {form.type === "coupon" && (
          <label className="block">
            <span className="title-sm">Coupon code</span>
            <input
              value={form.couponCode}
              onChange={(e) => setForm({ ...form, couponCode: e.target.value })}
              className={`${inputCls} uppercase`}
            />
          </label>
        )}
        <label className="block">
          <span className="title-sm">Affiliate / redirect URL</span>
          <input
            type="url"
            value={form.affiliateUrl}
            onChange={(e) => setForm({ ...form, affiliateUrl: e.target.value })}
            className={inputCls}
            required
          />
        </label>
        <label className="block">
          <span className="title-sm">Discount label</span>
          <input
            value={form.discountLabel}
            onChange={(e) => setForm({ ...form, discountLabel: e.target.value })}
            placeholder="UPTO 80% OFF"
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="title-sm">Terms & conditions</span>
          <textarea
            value={form.terms}
            onChange={(e) => setForm({ ...form, terms: e.target.value })}
            rows={3}
            className={`${inputCls} !h-auto py-3`}
          />
        </label>
        <div>
          <span className="title-sm">Categories</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c) => (
              <label
                key={c.id}
                className={`caption-strong px-3 py-1.5 rounded-full cursor-pointer border ${
                  form.categoryIds.includes(c.id)
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-surface-strong border-transparent text-ink"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form.categoryIds.includes(c.id)}
                  onChange={() => toggleCat(c.id)}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="title-sm">Bank / wallet tags (comma-separated)</span>
          <input
            value={form.bankTags}
            onChange={(e) => setForm({ ...form, bankTags: e.target.value })}
            placeholder="HDFC, Paytm, SBI"
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="title-sm">Expiry date</span>
          <input
            type="date"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            className={inputCls}
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.isExclusive}
            onChange={(e) => setForm({ ...form, isExclusive: e.target.checked })}
          />
          Exclusive (click-to-reveal)
        </label>
        {error && <p className="text-sm text-error font-semibold">{error}</p>}
        <div className="flex gap-3 items-center">
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save offer"}
          </ButtonPrimary>
          <Link href="/admin/offers" className="nav-link text-muted">
            Cancel
          </Link>
        </div>
      </form>
    </FeatureCard>
  );
}
