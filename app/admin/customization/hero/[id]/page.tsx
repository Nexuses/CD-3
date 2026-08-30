import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { HeroSlide } from "@/lib/models";
import { asObjectId, withId } from "@/lib/serialize";
import { HeroSlideForm } from "@/components/customization/hero-slide-form";

export default async function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await connectDB();
  const oid = asObjectId((await params).id);
  if (!oid) notFound();
  const slide = await HeroSlide.findById(oid).lean();
  if (!slide) notFound();
  const row = withId(slide)!;

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
        → Edit
      </p>
      <h1 className="display-sm text-ink m-0 !text-[28px]">Edit hero slide</h1>
      <HeroSlideForm
        initial={{
          id: row.id,
          name: String(row.name),
          title: String(row.title),
          description: String(row.description),
          ctaLabel: String(row.ctaLabel),
          href: String(row.href),
          image: String(row.image),
          alt: String(row.alt),
          sortOrder: Number(row.sortOrder) || 0,
          isActive: Boolean(row.isActive),
        }}
      />
    </div>
  );
}
