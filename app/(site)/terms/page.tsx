import { StaticPage } from "@/components/static-page";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <StaticPage title="Terms & Conditions">
      <p>
        CouponChrome provides promotional codes and deal links as-is. Merchants set
        offer terms; we are not responsible for expired codes, stockouts, or merchant
        policy changes.
      </p>
      <p>
        CouponChrome is not affiliated with or endorsed by the brands listed unless
        explicitly stated. Brand names and logos are trademarks of their respective
        owners.
      </p>
      <p>Use of the admin panel is restricted to authorized operators only.</p>
    </StaticPage>
  );
}
