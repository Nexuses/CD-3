import { StaticPage } from "@/components/static-page";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <StaticPage title="About CouponChrome">
      <p>
        CouponChrome is a coupons and deals directory built for shoppers who want
        verified promo codes without the fluff. Our chrome-inspired interface keeps
        browsing dense, fast, and focused on savings.
      </p>
      <p>
        We curate offers across fashion, electronics, food, travel, and more — so you
        can find the right code before you check out.
      </p>
    </StaticPage>
  );
}
