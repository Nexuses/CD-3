import Link from "next/link";
import { LogoMark } from "./ui";

export function SiteFooter({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  return (
    <footer className="bg-canvas border-t border-hairline-soft mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        <div className="col-span-2">
          <LogoMark />
          <p className="body-sm mt-4 max-w-xs">
            India&apos;s trusted coupons &amp; deals directory. Verified codes for Amazon, Flipkart, Myntra, and more.
          </p>
        </div>
        <div>
          <h3 className="title-sm text-ink mb-3">Help</h3>
          <ul className="space-y-2 caption text-ink-subtle">
            <li>
              <Link href="/how-it-works" className="hover:text-ink">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-ink">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-ink">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="title-sm text-ink mb-3">Company</h3>
          <ul className="space-y-2 caption text-ink-subtle">
            <li>
              <Link href="/about" className="hover:text-ink">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-ink">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-ink">
                Terms
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-2">
          <h3 className="title-sm text-ink mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="caption-strong px-3 py-1.5 rounded-md bg-surface-2 text-ink-muted hover:text-ink"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-hairline-soft">
        <div className="max-w-[1280px] mx-auto px-4 py-6 caption text-center md:text-left">
          © 2026 Clicks 4 Coupon. Coupons & deals directory. Not affiliated with listed merchants.
        </div>
      </div>
    </footer>
  );
}
