"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAppRouter } from "@/lib/use-app-router";
import { LogoMark, ButtonPrimary, ButtonSecondary } from "./ui";
import { BrandLogo } from "./store-tile";

type Cat = { id: string; slug: string; name: string; _count?: { offers: number } };
type Store = { id: string; slug: string; name: string; logo: string; offerCount: number };

export function SiteHeader({
  categories,
  topStores,
}: {
  categories: Cat[];
  topStores: Store[];
}) {
  const router = useAppRouter();
  const [q, setQ] = useState("");
  const [openMenu, setOpenMenu] = useState<"cat" | "stores" | "mobile" | null>(null);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/stores?q=${encodeURIComponent(query)}`);
    setOpenMenu(null);
  }

  return (
    <header className="sticky top-0 z-40 bg-canvas border-b border-hairline-soft">
      <div className="max-w-[1280px] mx-auto h-14 px-4 flex items-center gap-4">
        <Link href="/" className="shrink-0" onClick={() => setOpenMenu(null)}>
          <LogoMark />
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5 flex-1">
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("cat")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button type="button" className="nav-link px-3 py-2 text-ink hover:text-ink-muted rounded-md">
              Categories
            </button>
            {openMenu === "cat" && (
              <div className="absolute left-0 top-full pt-2 z-50">
                <div className="w-72 rounded-lg border border-hairline bg-surface-1 p-2">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
                      className="block px-3 py-2.5 text-sm text-ink-muted hover:bg-canvas hover:text-ink rounded-md"
                      onClick={() => setOpenMenu(null)}
                    >
                      {c.name}
                    </Link>
                  ))}
                  <Link
                    href="/stores"
                    className="block px-3 py-2.5 text-sm font-medium text-fin-orange"
                    onClick={() => setOpenMenu(null)}
                  >
                    View all →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("stores")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button type="button" className="nav-link px-3 py-2 text-ink hover:text-ink-muted rounded-md">
              Top Stores
            </button>
            {openMenu === "stores" && (
              <div className="absolute left-0 top-full pt-2 z-50">
                <div className="w-80 max-h-80 overflow-auto rounded-lg border border-hairline bg-surface-1 p-2">
                  {topStores.map((s) => (
                    <Link
                      key={s.id}
                      href={`/${s.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-canvas rounded-md"
                      onClick={() => setOpenMenu(null)}
                    >
                      <BrandLogo src={s.logo} name={s.name} size={32} />
                      <span className="text-sm font-medium text-ink flex-1">{s.name}</span>
                      <span className="caption">{s.offerCount}</span>
                    </Link>
                  ))}
                  <Link
                    href="/stores"
                    className="block px-3 py-2.5 text-sm font-medium text-fin-orange"
                    onClick={() => setOpenMenu(null)}
                  >
                    View all stores →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/#todays-offers" className="nav-link px-3 py-2 text-ink hover:text-ink-muted">
            Best Offers
          </Link>
          <Link href="/stores" className="nav-link px-3 py-2 text-ink hover:text-ink-muted">
            Stores
          </Link>
        </nav>

        <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-xs ml-auto">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search stores, categories, or offers…"
            className="w-full h-10 px-3.5 text-sm bg-surface-1 border border-hairline rounded-md outline-none focus:border-ink text-ink placeholder:text-ink-tertiary"
          />
        </form>

        <Link
          href="/admin/login"
          className="hidden sm:inline-flex nav-link text-ink-subtle hover:text-ink px-2"
        >
          Admin
        </Link>

        <Link href="/stores" className="hidden sm:block shrink-0">
          <ButtonPrimary type="button">Browse deals</ButtonPrimary>
        </Link>

        <button
          type="button"
          className="lg:hidden ml-auto nav-link text-ink px-2"
          onClick={() => setOpenMenu(openMenu === "mobile" ? null : "mobile")}
          aria-expanded={openMenu === "mobile"}
        >
          Menu
        </button>
      </div>

      {openMenu === "mobile" && (
        <div className="lg:hidden border-t border-hairline-soft bg-canvas px-4 py-3 space-y-1">
          <form onSubmit={onSearch} className="mb-3 md:hidden">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="w-full h-11 px-3.5 text-sm bg-surface-1 border border-hairline rounded-md outline-none focus:border-ink"
            />
          </form>
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="block px-3 py-2.5 text-sm rounded-md hover:bg-surface-2"
              onClick={() => setOpenMenu(null)}
            >
              {c.name}
            </Link>
          ))}
          <Link href="/stores" className="block px-3 py-2.5 text-sm font-medium text-fin-orange" onClick={() => setOpenMenu(null)}>
            All Stores
          </Link>
          <Link href="/admin/login" className="block px-3 py-2.5 text-sm text-ink-subtle" onClick={() => setOpenMenu(null)}>
            Admin Login
          </Link>
          <div className="pt-2">
            <ButtonSecondary type="button" className="w-full" onClick={() => setOpenMenu(null)}>
              Close
            </ButtonSecondary>
          </div>
        </div>
      )}
    </header>
  );
}
