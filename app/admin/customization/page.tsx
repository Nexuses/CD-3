import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { FeatureCard } from "@/components/ui";

const SECTIONS = [
  {
    href: "/admin/customization/icons",
    title: "Category & store icons",
    description: "Manage homepage category icons, store icons, and store logos.",
  },
  {
    href: "/admin/customization/hero",
    title: "Hero section",
    description: "Carousel slides — image, title, description, button text and link.",
  },
  {
    href: "/admin/customization/spotlight",
    title: "Spotlight coupons",
    description: "Toggle stores and offers into the homepage spotlight row.",
  },
  {
    href: "/admin/customization/deals",
    title: "Deals of the week",
    description: "Customize weekly deal banners — image, logo, copy, and CTA.",
  },
];

export default async function CustomizationHubPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-sm text-ink m-0 !text-[28px]">Customization</h1>
        <p className="body-md mt-2 mb-0 text-muted">
          Manage homepage visuals and featured content. Images use URL paths (e.g.{" "}
          <code className="text-xs">/images/home/hero/amazon.png</code>).
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href}>
            <FeatureCard className="h-full hover:shadow-soft transition-shadow">
              <h2 className="title-md m-0 mb-2">{s.title}</h2>
              <p className="body-sm m-0 text-muted">{s.description}</p>
            </FeatureCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
