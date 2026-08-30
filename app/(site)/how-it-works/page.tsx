import { StaticPage } from "@/components/static-page";

export const metadata = { title: "How It Works" };

export default function HowItWorksPage() {
  return (
    <StaticPage title="How It Works">
      <ol className="list-decimal pl-4 space-y-2">
        <li>Browse stores or categories to find a coupon or deal.</li>
        <li>
          Click <strong>Get Coupon</strong> or <strong>Get Deal</strong>.
        </li>
        <li>Copy the code (if any) and visit the merchant site via our link.</li>
        <li>Paste the code at checkout and enjoy the savings.</li>
      </ol>
      <p>
        Clicks 4 Coupon is a directory of promo codes and deals. We earn affiliate
        commissions when you shop through our links — at no extra cost to you.
      </p>
    </StaticPage>
  );
}
