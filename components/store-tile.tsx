import Link from "next/link";

export function StoreTile({
  slug,
  name,
  logo,
  offerCount,
  couponCount,
  dealCount,
  compact = false,
}: {
  slug: string;
  name: string;
  logo: string;
  offerCount: number;
  couponCount?: number;
  dealCount?: number;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/${slug}`}
      className={`bg-surface-1 border border-hairline rounded-lg hover:border-ink/20 transition-colors block ${
        compact ? "p-4 min-w-[132px] text-center" : "p-5"
      }`}
    >
      <div
        className={`logo-tile mx-auto ${
          compact ? "w-14 h-14 mb-3" : "w-16 h-16 mb-3"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={`${name} logo`} className="w-full h-full" />
      </div>
      <p className="title-sm text-ink text-center m-0 truncate">{name}</p>
      <p className="caption text-center m-0 mt-1">
        {offerCount} offer{offerCount !== 1 ? "s" : ""}
      </p>
      {!compact && couponCount !== undefined && dealCount !== undefined && (
        <p className="caption text-center m-0 mt-1 text-ink-tertiary">
          {couponCount} coupon{couponCount !== 1 ? "s" : ""} · {dealCount} deal
          {dealCount !== 1 ? "s" : ""}
        </p>
      )}
    </Link>
  );
}

export function BrandLogo({
  src,
  name,
  size = 40,
}: {
  src: string;
  name: string;
  size?: number;
}) {
  return (
    <div
      className="logo-tile shrink-0"
      style={{ width: size, height: size }}
      title={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`${name} logo`} className="w-full h-full" />
    </div>
  );
}
