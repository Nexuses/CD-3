import { StaticPage } from "@/components/static-page";

export const metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <StaticPage title="Frequently Asked Questions">
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-ink m-0">Do I need an account?</h3>
          <p className="m-0 mt-1">
            No. Anyone can browse offers and copy coupon codes without signing up.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-ink m-0">Why didn&apos;t my coupon work?</h3>
          <p className="m-0 mt-1">
            Codes can expire or have cart minimums. Check the offer terms, try another
            code, or use a deal that doesn&apos;t require a code.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-ink m-0">How do you make money?</h3>
          <p className="m-0 mt-1">
            Through affiliate links. When you shop via CouponChrome, merchants may pay
            us a commission.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-ink m-0">How do I add my store?</h3>
          <p className="m-0 mt-1">
            Contact us via the Contact page. Admins manage all store and offer content.
          </p>
        </div>
      </div>
    </StaticPage>
  );
}
