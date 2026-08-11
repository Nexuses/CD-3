"use client";

const IMG = "/images/spend-lens";

export function SpendLensLoginRewards() {
  return (
    <div className="flex flex-col justify-end gap-6 font-metropolis sm:flex-row">
      {/* Total spend / login card */}
      <div
        id="total-spend"
        className="relative flex min-h-[192px] w-full flex-grow flex-shrink rounded-lg bg-yellow-400 sm:min-h-[248px]"
      >
        <div
          className="absolute inset-0 z-0 rounded-lg bg-cover bg-right bg-no-repeat"
          style={{ backgroundImage: `url(${IMG}/spendCalc__spendBg.png)` }}
        />
        <div className="relative z-10 flex w-full flex-col justify-between gap-4 p-5 sm:p-6 md:flex-row md:items-end">
          <div className="max-w-md">
            <p className="text-base font-bold text-slate-950 sm:text-xl">
              Log in and add stores to track your spending
            </p>
          </div>
          <div className="flex w-fit flex-col">
            <div className="flex items-center gap-2 text-4xl font-bold text-slate-950 xs:text-6xl">
              <span>******</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/lock.svg`} alt="lock icon" className="h-8 w-8 sm:h-12 sm:w-12" />
            </div>
            <button
              type="button"
              className="mt-3 max-w-[156px] w-full cursor-pointer rounded bg-indigo-600 px-4 py-3 text-center font-bold text-white"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Rewards program card */}
      <div
        id="refer-v2"
        className="group relative inline-block w-full max-w-[400px] overflow-hidden rounded-lg shadow-2xl transition-all duration-300 hover:shadow-indigo-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 opacity-100" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl transition-all duration-700 group-hover:bg-yellow-400/20" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-700 group-hover:bg-indigo-500/20" />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ backgroundImage: `url(${IMG}/mesh.B8EeDzsb.png)`, backgroundSize: "cover" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 bg-contain bg-no-repeat opacity-80"
          style={{ backgroundImage: `url(${IMG}/coinBg.UeJdjK10.png)` }}
        />

        <div className="relative flex min-h-[260px] flex-col justify-between rounded-lg border border-white/10 p-4 sm:p-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                Rewards Program
              </span>
            </div>
            <h4 className="text-2xl font-black leading-tight text-white">
              Earn{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Massive Rewards
              </span>
            </h4>
            <p className="text-sm leading-relaxed text-slate-300">
              Invite friends to unlock{" "}
              <span className="font-bold text-white">up to 12% reward points</span> and enjoy{" "}
              <span className="font-semibold text-white">massive discounts</span> on every coupon
              &amp; cashback offer.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <button
              type="button"
              className="w-full rounded-lg bg-indigo-600 px-8 py-3.5 text-center font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-95"
            >
              Get Massive Rewards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
