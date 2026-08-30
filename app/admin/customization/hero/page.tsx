import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { HeroSlide } from "@/lib/models";
import { mapId } from "@/lib/serialize";
import { FeatureCard, ButtonPrimary } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";

export default async function CustomizationHeroPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await connectDB();
  const slides = mapId(await HeroSlide.find().sort({ sortOrder: 1, createdAt: 1 }).lean());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="caption mb-2">
            <Link href="/admin/customization" className="hover:text-ink">
              Customization
            </Link>{" "}
            → Hero
          </p>
          <h1 className="display-sm text-ink m-0 !text-[28px]">Hero section</h1>
        </div>
        <Link href="/admin/customization/hero/new">
          <ButtonPrimary type="button">+ Add slide</ButtonPrimary>
        </Link>
      </div>

      <FeatureCard className="!p-0 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-soft caption-strong text-muted">
            <tr>
              <th className="p-4">Preview</th>
              <th className="p-4">Title</th>
              <th className="p-4">Order</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted">
                  No hero slides yet. Add one or run db:seed.
                </td>
              </tr>
            ) : (
              slides.map((s) => (
                <tr key={s.id} className="border-t border-hairline">
                  <td className="p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={String(s.image)}
                      alt=""
                      className="h-12 w-20 rounded object-cover"
                    />
                  </td>
                  <td className="p-4 font-semibold">{String(s.title)}</td>
                  <td className="p-4">{String(s.sortOrder)}</td>
                  <td className="p-4">
                    {s.isActive ? (
                      <span className="caption-strong text-primary">Active</span>
                    ) : (
                      <span className="caption-strong text-muted">Hidden</span>
                    )}
                  </td>
                  <td className="p-4 space-x-3 whitespace-nowrap">
                    <Link
                      href={`/admin/customization/hero/${s.id}`}
                      className="text-primary font-semibold"
                    >
                      Edit
                    </Link>
                    <DeleteButton endpoint={`/api/admin/customization/hero/${s.id}`} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </FeatureCard>
    </div>
  );
}
