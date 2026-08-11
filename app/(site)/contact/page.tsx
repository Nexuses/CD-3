import { StaticPage } from "@/components/static-page";
import Link from "next/link";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <StaticPage title="Contact Us">
      <p>
        Questions about an offer, partnership, or the admin demo? Email{" "}
        <strong className="text-ink">hello@couponchrome.demo</strong> (placeholder for
        this demo build).
      </p>
      <p>
        Admin operators can sign in at{" "}
        <Link href="/admin/login" className="text-signal font-bold underline">
          /admin/login
        </Link>
        .
      </p>
    </StaticPage>
  );
}
