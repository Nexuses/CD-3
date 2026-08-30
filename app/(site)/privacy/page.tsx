import { StaticPage } from "@/components/static-page";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy">
      <p>
        Clicks 4 Coupon uses essential cookies for the admin session only. Public visitors
        can browse without an account. We do not sell personal data.
      </p>
      <p>
        Outbound shopping links may include affiliate tracking parameters so merchants
        can attribute referrals. Click counts on offers are stored anonymously.
      </p>
      <p>For privacy questions, reach out via the Contact page.</p>
    </StaticPage>
  );
}
