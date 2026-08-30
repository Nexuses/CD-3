"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FeatureCard, ButtonPrimary } from "@/components/ui";

const inputCls =
  "mt-1 w-full h-10 px-3 text-sm bg-canvas border border-hairline rounded-md outline-none focus:border-primary";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  showOnHome: boolean;
  homeOrder: number;
  homeHref: string;
};

type StoreRow = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  logo: string;
};

export function IconsManager({
  categories,
  stores,
}: {
  categories: CategoryRow[];
  stores: StoreRow[];
}) {
  const router = useRouter();
  const [cats, setCats] = useState(categories);
  const [merchants, setMerchants] = useState(stores);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"cat" | "store" | null>(null);

  async function saveCategories() {
    setLoading("cat");
    setError("");
    try {
      const res = await fetch("/api/admin/customization/icons/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cats }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save categories");
        return;
      }
      router.refresh();
    } catch {
      setError("Failed to save categories");
    } finally {
      setLoading(null);
    }
  }

  async function saveStores() {
    setLoading("store");
    setError("");
    try {
      const res = await fetch("/api/admin/customization/icons/stores", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: merchants }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save stores");
        return;
      }
      router.refresh();
    } catch {
      setError("Failed to save stores");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-8">
      {error && <p className="text-sm text-error font-semibold">{error}</p>}

      <FeatureCard className="!p-0 overflow-hidden">
        <div className="px-5 pt-5 pb-2 flex items-center justify-between gap-2">
          <h2 className="title-md m-0">Category icons (homepage row)</h2>
          <ButtonPrimary type="button" disabled={loading === "cat"} onClick={saveCategories}>
            {loading === "cat" ? "Saving…" : "Save categories"}
          </ButtonPrimary>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-soft caption-strong text-muted">
              <tr>
                <th className="p-3">Preview</th>
                <th className="p-3">Name</th>
                <th className="p-3">Icon URL</th>
                <th className="p-3">Home link</th>
                <th className="p-3">Order</th>
                <th className="p-3">On home</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c, i) => (
                <tr key={c.id} className="border-t border-hairline">
                  <td className="p-3">
                    {c.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.icon} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">
                    <input
                      className={inputCls}
                      value={c.icon}
                      onChange={(e) => {
                        const next = [...cats];
                        next[i] = { ...c, icon: e.target.value };
                        setCats(next);
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      className={inputCls}
                      value={c.homeHref}
                      placeholder={`/category/${c.slug}`}
                      onChange={(e) => {
                        const next = [...cats];
                        next[i] = { ...c, homeHref: e.target.value };
                        setCats(next);
                      }}
                    />
                  </td>
                  <td className="p-3 w-20">
                    <input
                      type="number"
                      className={inputCls}
                      value={c.homeOrder}
                      onChange={(e) => {
                        const next = [...cats];
                        next[i] = { ...c, homeOrder: Number(e.target.value) };
                        setCats(next);
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={c.showOnHome}
                      onChange={(e) => {
                        const next = [...cats];
                        next[i] = { ...c, showOnHome: e.target.checked };
                        setCats(next);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FeatureCard>

      <FeatureCard className="!p-0 overflow-hidden">
        <div className="px-5 pt-5 pb-2 flex items-center justify-between gap-2">
          <div>
            <h2 className="title-md m-0">Store icons & logos</h2>
            <p className="caption m-0 mt-1">
              Full store details are in{" "}
              <Link href="/admin/stores" className="text-primary">
                Stores
              </Link>
              .
            </p>
          </div>
          <ButtonPrimary type="button" disabled={loading === "store"} onClick={saveStores}>
            {loading === "store" ? "Saving…" : "Save stores"}
          </ButtonPrimary>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-soft caption-strong text-muted">
              <tr>
                <th className="p-3">Preview</th>
                <th className="p-3">Store</th>
                <th className="p-3">Icon URL</th>
                <th className="p-3">Logo URL</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((m, i) => (
                <tr key={m.id} className="border-t border-hairline">
                  <td className="p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.icon || m.logo}
                      alt=""
                      className="h-10 w-10 rounded-full object-contain bg-surface-2"
                    />
                  </td>
                  <td className="p-3 font-medium">{m.name}</td>
                  <td className="p-3">
                    <input
                      className={inputCls}
                      value={m.icon}
                      onChange={(e) => {
                        const next = [...merchants];
                        next[i] = { ...m, icon: e.target.value };
                        setMerchants(next);
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      className={inputCls}
                      value={m.logo}
                      onChange={(e) => {
                        const next = [...merchants];
                        next[i] = { ...m, logo: e.target.value };
                        setMerchants(next);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FeatureCard>
    </div>
  );
}
