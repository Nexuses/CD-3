"use client";

import { FormEvent, useState } from "react";
import { useAppRouter } from "@/lib/use-app-router";
import Link from "next/link";
import { FeatureCard, ButtonPrimary } from "@/components/ui";

const inputCls =
  "mt-1.5 w-full h-12 px-4 text-sm bg-canvas border border-hairline rounded-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

type HeroFormData = {
  id?: string;
  name: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  image: string;
  alt: string;
  sortOrder: number;
  isActive: boolean;
};

export function HeroSlideForm({ initial }: { initial?: HeroFormData }) {
  const router = useAppRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState<HeroFormData>(
    initial || {
      name: "",
      title: "",
      description: "",
      ctaLabel: "Explore now",
      href: "/stores",
      image: "",
      alt: "",
      sortOrder: 0,
      isActive: true,
    },
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = isEdit
        ? `/api/admin/customization/hero/${initial!.id}`
        : "/api/admin/customization/hero";
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
      router.push("/admin/customization/hero");
      router.refresh();
    } catch {
      setError("Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FeatureCard>
      <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
        <label className="block">
          <span className="title-sm">Brand / label name</span>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="title-sm">Title</span>
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="title-sm">Description</span>
          <textarea
            className={`${inputCls} !h-auto py-3`}
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="title-sm">Image URL</span>
          <input
            className={inputCls}
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="title-sm">Image alt text</span>
          <input
            className={inputCls}
            value={form.alt}
            onChange={(e) => setForm({ ...form, alt: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="title-sm">Button text</span>
          <input
            className={inputCls}
            value={form.ctaLabel}
            onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="title-sm">Button link</span>
          <input
            className={inputCls}
            value={form.href}
            onChange={(e) => setForm({ ...form, href: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="title-sm">Sort order</span>
          <input
            type="number"
            className={inputCls}
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active (visible on homepage)
        </label>
        {error && <p className="text-sm text-error font-semibold">{error}</p>}
        <div className="flex gap-3">
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save slide"}
          </ButtonPrimary>
          <Link href="/admin/customization/hero" className="nav-link text-muted">
            Cancel
          </Link>
        </div>
      </form>
    </FeatureCard>
  );
}
