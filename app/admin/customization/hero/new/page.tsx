import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { HeroSlideForm } from "@/components/customization/hero-slide-form";

export default async function NewHeroSlidePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="space-y-3">
      <p className="caption mb-2">
        <Link href="/admin/customization" className="hover:text-ink">
          Customization
        </Link>{" "}
        →{" "}
        <Link href="/admin/customization/hero" className="hover:text-ink">
          Hero
        </Link>{" "}
        → New
      </p>
      <h1 className="display-sm text-ink m-0 !text-[28px]">Add hero slide</h1>
      <HeroSlideForm />
    </div>
  );
}
