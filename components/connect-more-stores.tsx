"use client";

const IMG = "/images/spend-lens";

const MORE_STORES = [
  { name: "Pharmeasy", logo: `${IMG}/pharmeasy.png` },
  { name: "Goibibo", logo: `${IMG}/goibibo.png` },
  { name: "Urban Company", logo: `${IMG}/urbancompany.png` },
  { name: "Jio.Com", logo: `${IMG}/jio.png` },
  { name: "Paytm", logo: `${IMG}/paytm.png` },
  { name: "NewMeAsia", logo: `${IMG}/newme.png` },
  { name: "1mg", logo: `${IMG}/1mg.png` },
  { name: "Bewakoof", logo: `${IMG}/bewakoof.png` },
  { name: "Apple", logo: `${IMG}/apple.png` },
  { name: "Myntra", logo: `${IMG}/myntra.png` },
  { name: "Swissmilitary", logo: `${IMG}/swissmilitary.svg` },
  { name: "Ajio", logo: `${IMG}/ajio.png` },
  { name: "Nykaa", logo: `${IMG}/nykaa.png` },
  { name: "Meesho", logo: `${IMG}/meesho.png` },
  { name: "Blinkit", logo: `${IMG}/blinkit.png` },
];

export function ConnectMoreStores() {
  return (
    <div
      id="connect-more-stores"
      className="relative left-[50%] -ml-[50vw] my-16 w-screen bg-indigo-50 py-16 font-metropolis"
    >
      <div className="mx-auto max-w-[920px] px-4 xs:px-6">
        <h3 className="text-base font-bold text-slate-950 sm:text-xl">
          Analyze even more stores
        </h3>

        <div className="mt-4 flex flex-wrap gap-4">
          {MORE_STORES.map((store, index) => (
            <button
              key={store.name}
              type="button"
              data-pos={index}
              className="flex h-[184px] w-[136px] cursor-pointer flex-col justify-between gap-2 rounded-lg p-3 ring-1 ring-slate-200 transition hover:ring-indigo-600 xs:p-4"
            >
              <div className="flex flex-col items-start gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={store.logo}
                  alt={`${store.name} logo`}
                  className="h-[56px] w-[56px] rounded-full object-contain shadow-sm bg-white"
                />
                <span className="text-sm font-bold capitalize text-slate-950">
                  {store.name.length > 12 ? `${store.name.slice(0, 12)}...` : store.name}
                </span>
              </div>
              <span className="text-sm font-bold text-indigo-600">Analyze</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
