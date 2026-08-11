"use client";

import { useState } from "react";

const IMG = "/images/spend-lens";

const CATEGORIES = [
  "All Stores",
  "Groceries",
  "Food & Drink",
  "E-commerce",
  "LifeStyle",
  "Travel",
  "Entertainment",
] as const;

const STORES = [
  { name: "Amazon", logo: `${IMG}/amazon.png` },
  { name: "Flipkart", logo: `${IMG}/Flipkart.BcYHr_z_.png` },
  { name: "Myntra", logo: `${IMG}/myntra.png` },
  { name: "Croma", logo: `${IMG}/croma.png` },
  { name: "Swiggy", logo: `${IMG}/swiggy.png` },
  { name: "Zomato", logo: `${IMG}/zomato.png` },
  { name: "Ajio", logo: `${IMG}/ajio.png` },
  { name: "Nykaa", logo: `${IMG}/nykaa.png` },
];

export function SpendLensPanel() {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("All Stores");
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-xl shadow-slate-200/50 md:px-10 md:py-10 font-metropolis">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${IMG}/gradient.DB7vAfk5.svg`}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG}/buyhatkeSpendCalc.CLzYvzHW.png`}
              alt="Spend Lens"
              className="h-10 w-10 object-contain"
            />
            <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">Spend Lens</h2>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-950 hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/add.svg`} alt="" width={32} height={32} className="h-6 w-6" />
            Add store
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {STORES.map((store, index) => {
              const isSelected = selected === store.name;
              return (
                <button
                  key={store.name}
                  type="button"
                  data-pos={index}
                  onClick={() => setSelected(store.name)}
                  className="h-full cursor-pointer disabled:cursor-not-allowed"
                >
                  <div
                    className={`flex h-[184px] w-[136px] flex-col justify-between gap-2 rounded-lg p-3 xs:p-4 font-metropolis hover:ring-indigo-600 ${
                      isSelected ? "ring-4 ring-indigo-600" : "ring-1 ring-slate-200"
                    }`}
                  >
                    <div className="flex flex-col items-start gap-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={store.logo}
                        alt={`${store.name} logo`}
                        width={48}
                        height={48}
                        className="aspect-square rounded-full drop-shadow-sm object-contain bg-white"
                      />
                      <span className="text-sm font-medium xs:font-bold text-slate-950 text-nowrap capitalize">
                        {store.name}
                      </span>
                      <span className="text-2xs text-slate-500 font-medium">Not synced</span>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">Analyze</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
