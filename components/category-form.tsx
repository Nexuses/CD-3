"use client";

import { FormEvent, useState } from "react";
import { useAppRouter } from "@/lib/use-app-router";
import Link from "next/link";
import { FeatureCard, ButtonPrimary } from "@/components/ui";
import { slugify } from "@/lib/utils";

type CatOption = { id: string; name: string };

const inputCls =
  "mt-1.5 w-full h-12 px-4 text-sm bg-canvas border border-hairline rounded-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function CategoryForm({
  initial,
  parents,
}: {
  initial?: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
  };
  parents: CatOption[];
}) {
  const router = useAppRouter();
  const isEdit = Boolean(initial?.id);
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [parentId, setParentId] = useState(initial?.parentId?.toString() || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = isEdit
        ? `/api/admin/categories/${initial!.id}`
        : "/api/admin/categories";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug || slugify(name),
          parentId: parentId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      router.push("/admin/categories");
      router.refresh();
    } catch {
      setError("Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FeatureCard>
      <h2 className="title-md mb-4">{isEdit ? "Edit category" : "Add category"}</h2>
      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        <label className="block">
          <span className="title-sm">Name</span>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!isEdit) setSlug(slugify(e.target.value));
            }}
            className={inputCls}
            required
          />
        </label>
        <label className="block">
          <span className="title-sm">Slug</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputCls}
            required
          />
        </label>
        <label className="block">
          <span className="title-sm">Parent category</span>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className={inputCls}
          >
            <option value="">None (top-level)</option>
            {parents
              .filter((p) => p.id !== initial?.id)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </label>
        {error && <p className="text-sm text-error font-semibold">{error}</p>}
        <div className="flex gap-3 items-center">
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </ButtonPrimary>
          <Link href="/admin/categories" className="nav-link text-muted">
            Cancel
          </Link>
        </div>
      </form>
    </FeatureCard>
  );
}
