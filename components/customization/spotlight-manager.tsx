"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FeatureCard, ButtonPrimary } from "@/components/ui";

const inputCls =
  "mt-1 w-full h-9 px-2 text-sm bg-canvas border border-hairline rounded-md outline-none focus:border-primary";

type MerchantRow = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  isSpotlight: boolean;
  spotlightImage: string;
  spotlightSubtitle: string;
  spotlightOrder: number;
};

type OfferRow = {
  id: string;
  title: string;
  subtitle: string;
  discountLabel: string;
  isSpotlight: boolean;
  spotlightImage: string;
  spotlightSubtitle: string;
  spotlightOrder: number;
  merchant: { name: string; slug: string } | null;
};

export function SpotlightManager({
  merchants,
  offers,
}: {
  merchants: MerchantRow[];
  offers: OfferRow[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"stores" | "coupons">("stores");
  const [storeRows, setStoreRows] = useState(merchants);
  const [offerRows, setOfferRows] = useState(offers);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/customization/spotlight", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchants: storeRows.map((m) => ({
            id: m.id,
            isSpotlight: m.isSpotlight,
            spotlightImage: m.spotlightImage,
            spotlightSubtitle: m.spotlightSubtitle,
            spotlightOrder: m.spotlightOrder,
          })),
          offers: offerRows.map((o) => ({
            id: o.id,
            isSpotlight: o.isSpotlight,
            spotlightImage: o.spotlightImage,
            spotlightSubtitle: o.spotlightSubtitle,
            spotlightOrder: o.spotlightOrder,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Save failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("stores")}
          className={`nav-link rounded-full px-4 py-2 ${tab === "stores" ? "bg-primary text-on-primary" : "bg-surface-strong"}`}
        >
          Stores
        </button>
        <button
          type="button"
          onClick={() => setTab("coupons")}
          className={`nav-link rounded-full px-4 py-2 ${tab === "coupons" ? "bg-primary text-on-primary" : "bg-surface-strong"}`}
        >
          Coupons / offers
        </button>
        <ButtonPrimary type="button" className="ml-auto" disabled={loading} onClick={save}>
          {loading ? "Saving…" : "Save spotlight"}
        </ButtonPrimary>
      </div>

      {error && <p className="text-sm text-error font-semibold">{error}</p>}

      {tab === "stores" ? (
        <FeatureCard className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-soft caption-strong text-muted">
                <tr>
                  <th className="p-3">Spotlight</th>
                  <th className="p-3">Store</th>
                  <th className="p-3">Subtitle</th>
                  <th className="p-3">Image override</th>
                  <th className="p-3">Order</th>
                </tr>
              </thead>
              <tbody>
                {storeRows.map((m, i) => (
                  <tr key={m.id} className="border-t border-hairline">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={m.isSpotlight}
                        onChange={(e) => {
                          const next = [...storeRows];
                          next[i] = { ...m, isSpotlight: e.target.checked };
                          setStoreRows(next);
                        }}
                      />
                    </td>
                    <td className="p-3 font-medium">{m.name}</td>
                    <td className="p-3">
                      <input
                        className={inputCls}
                        value={m.spotlightSubtitle}
                        onChange={(e) => {
                          const next = [...storeRows];
                          next[i] = { ...m, spotlightSubtitle: e.target.value };
                          setStoreRows(next);
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        className={inputCls}
                        placeholder={m.logo || "Image URL"}
                        value={m.spotlightImage}
                        onChange={(e) => {
                          const next = [...storeRows];
                          next[i] = { ...m, spotlightImage: e.target.value };
                          setStoreRows(next);
                        }}
                      />
                    </td>
                    <td className="p-3 w-20">
                      <input
                        type="number"
                        className={inputCls}
                        value={m.spotlightOrder}
                        onChange={(e) => {
                          const next = [...storeRows];
                          next[i] = { ...m, spotlightOrder: Number(e.target.value) };
                          setStoreRows(next);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FeatureCard>
      ) : (
        <FeatureCard className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-soft caption-strong text-muted">
                <tr>
                  <th className="p-3">Spotlight</th>
                  <th className="p-3">Offer</th>
                  <th className="p-3">Store</th>
                  <th className="p-3">Subtitle</th>
                  <th className="p-3">Image override</th>
                  <th className="p-3">Order</th>
                </tr>
              </thead>
              <tbody>
                {offerRows.map((o, i) => (
                  <tr key={o.id} className="border-t border-hairline">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={o.isSpotlight}
                        onChange={(e) => {
                          const next = [...offerRows];
                          next[i] = { ...o, isSpotlight: e.target.checked };
                          setOfferRows(next);
                        }}
                      />
                    </td>
                    <td className="p-3 font-medium max-w-[180px] truncate">{o.title}</td>
                    <td className="p-3">{o.merchant?.name || "—"}</td>
                    <td className="p-3">
                      <input
                        className={inputCls}
                        value={o.spotlightSubtitle}
                        placeholder={o.subtitle || o.discountLabel}
                        onChange={(e) => {
                          const next = [...offerRows];
                          next[i] = { ...o, spotlightSubtitle: e.target.value };
                          setOfferRows(next);
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        className={inputCls}
                        value={o.spotlightImage}
                        onChange={(e) => {
                          const next = [...offerRows];
                          next[i] = { ...o, spotlightImage: e.target.value };
                          setOfferRows(next);
                        }}
                      />
                    </td>
                    <td className="p-3 w-20">
                      <input
                        type="number"
                        className={inputCls}
                        value={o.spotlightOrder}
                        onChange={(e) => {
                          const next = [...offerRows];
                          next[i] = { ...o, spotlightOrder: Number(e.target.value) };
                          setOfferRows(next);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FeatureCard>
      )}
    </div>
  );
}
