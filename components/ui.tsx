import { ReactNode, ButtonHTMLAttributes } from "react";

export function LogoMark({
  className = "",
  onDark: _onDark = false,
  size = "md",
}: {
  className?: string;
  onDark?: boolean;
  size?: "sm" | "md";
}) {
  const height = size === "sm" ? 28 : 32;
  const maxWidth = size === "sm" ? 120 : 148;

  return (
    <span className={`inline-flex shrink-0 items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Clicks 4 Coupon"
        width={maxWidth}
        height={height}
        className="object-contain"
        style={{
          display: "block",
          height,
          maxHeight: height,
          width: "auto",
          maxWidth,
          objectFit: "contain",
        }}
      />
    </span>
  );
}

export function ButtonPrimary({
  children,
  className = "",
  size = "md",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { size?: "md" | "lg" }) {
  const sizeCls = size === "lg" ? "h-12 px-6 text-[15px]" : "h-10 px-[18px] text-[15px]";
  return (
    <button
      type={type}
      className={`btn-label inline-flex items-center justify-center rounded-md bg-ink text-on-primary hover:bg-primary-active disabled:bg-primary-disabled disabled:cursor-not-allowed transition-colors ${sizeCls} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** Fin Orange CTA — reserved for exclusive / high-intent offer actions */
export function ButtonAccent({
  children,
  className = "",
  size = "md",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { size?: "md" | "lg" }) {
  const sizeCls = size === "lg" ? "h-12 px-6 text-[15px]" : "h-10 px-[18px] text-[15px]";
  return (
    <button
      type={type}
      className={`btn-label inline-flex items-center justify-center rounded-md bg-fin-orange text-on-primary hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition ${sizeCls} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonSecondary({
  children,
  className = "",
  type = "button",
  dark = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { dark?: boolean }) {
  return (
    <button
      type={type}
      className={`btn-label inline-flex h-10 items-center justify-center rounded-md px-[18px] transition-colors ${
        dark
          ? "bg-inverse-surface-1 text-inverse-ink hover:brightness-110"
          : "bg-surface-1 text-ink border border-hairline hover:bg-surface-2"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonOutlineDark({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`btn-label inline-flex h-10 items-center justify-center rounded-md border border-inverse-ink px-[18px] text-inverse-ink hover:bg-white/10 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonTertiary({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`btn-label inline-flex items-center rounded-md px-[18px] py-2.5 text-ink hover:bg-surface-2 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function BadgePill({
  children,
  className = "",
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <span
      className={`eyebrow inline-flex items-center rounded-sm px-2.5 py-1 ${
        accent
          ? "bg-fin-orange/10 text-fin-orange"
          : "bg-surface-2 text-ink-muted"
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function FeatureCard({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-6 md:p-8 ${
        dark
          ? "bg-inverse-canvas text-inverse-ink"
          : "bg-surface-1 text-ink border border-hairline"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <BadgePill>{children}</BadgePill>;
}

/** @deprecated alias kept for gradual migration */
export function BevelPanel({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  inset?: boolean;
  id?: string;
}) {
  return (
    <div id={id} className={`rounded-lg border border-hairline bg-surface-1 ${className}`}>
      {children}
    </div>
  );
}

/** @deprecated */
export function SectionLabelBar({ title }: { title: string }) {
  return (
    <div className="px-6 pt-6 pb-2">
      <h2 className="title-md text-ink m-0">{title}</h2>
    </div>
  );
}

/** @deprecated — map to ButtonPrimary */
export function ButtonSubmit({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <ButtonPrimary type={type} className={className} {...props}>
      {children}
    </ButtonPrimary>
  );
}

/** @deprecated */
export const LogoPill = LogoMark;
export const CircleArrow = () => <span aria-hidden>→</span>;
export const ArrowChip = () => <span aria-hidden className="text-fin-orange">→</span>;
