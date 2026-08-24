"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FeatureCard, ButtonPrimary } from "@/components/ui";
import { slugify } from "@/lib/utils";

type StoreFormData = {
  id?: string;
  name: string;
  slug: string;
  logo: string;
  websiteUrl: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  isFeatured: boolean;
};

const inputCls =
  "mt-1.5 w-full h-12 px-4 text-sm bg-canvas border border-hairline rounded-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function StoreForm({ initial }: { initial?: StoreFormData }) {
  const router = useRouter();
  const [form, setForm] = useState<StoreFormData>(
    initial || {
      name: "",
      slug: "",
      logo: "",
      websiteUrl: "",
      description: "",
      seoTitle: "",
      seoDescription: "",
      isActive: true,
      isFeatured: false,
    },
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initial?.id);

  function set<K extends keyof StoreFormData>(key: K, value: StoreFormData[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "name" && !isEdit) next.slug = slugify(String(value));
      return next;
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/stores/${initial!.id}` : "/api/admin/stores";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      router.push("/admin/stores");
      router.refresh();
    } catch {
      setError("Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FeatureCard>
      <h2 className="title-md mb-4">{isEdit ? "Edit store" : "Add store"}</h2>
      <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
        {(
          [
            ["name", "Name", "text"],
            ["slug", "Slug", "text"],
            ["logo", "Logo URL", "text"],
            ["websiteUrl", "Website URL", "url"],
            ["seoTitle", "SEO Title", "text"],
          ] as const
        ).map(([key, label, type]) => (
          <label key={key} className="block">
            <span className="title-sm">{label}</span>
            <input
              type={type}
              value={String(form[key])}
              onChange={(e) => set(key, e.target.value)}
              className={inputCls}
              required={key === "name" || key === "slug"}
            />
          </label>
        ))}
        <label className="block">
          <span className="title-sm">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className={`${inputCls} !h-auto py-3`}
          />
        </label>
        <label className="block">
          <span className="title-sm">SEO Description</span>
          <textarea
            value={form.seoDescription}
            onChange={(e) => set("seoDescription", e.target.value)}
            rows={2}
            className={`${inputCls} !h-auto py-3`}
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
            className="rounded"
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => set("isFeatured", e.target.checked)}
            className="rounded"
          />
          Featured on homepage
        </label>
        {error && <p className="text-sm text-error font-semibold">{error}</p>}
        <div className="flex gap-3 items-center">
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save store"}
          </ButtonPrimary>
          <Link href="/admin/stores" className="nav-link text-muted">
            Cancel
          </Link>
        </div>
      </form>
    </FeatureCard>
  );
}
