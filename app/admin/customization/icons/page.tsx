import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Category, Merchant } from "@/lib/models";
import { mapId } from "@/lib/serialize";
import { IconsManager } from "@/components/customization/icons-manager";

export default async function CustomizationIconsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await connectDB();
  const [categoryDocs, storeDocs] = await Promise.all([
    Category.find().sort({ homeOrder: 1, name: 1 }).lean(),
    Merchant.find().sort({ name: 1 }).lean(),
  ]);

  const categories = mapId(categoryDocs).map((c) => ({
    id: c.id,
    name: String(c.name),
    slug: String(c.slug),
    icon: String(c.icon || ""),
    showOnHome: Boolean(c.showOnHome),
    homeOrder: Number(c.homeOrder) || 0,
    homeHref: String(c.homeHref || ""),
  }));

  const stores = mapId(storeDocs).map((m) => ({
    id: m.id,
    name: String(m.name),
    slug: String(m.slug),
    icon: String(m.icon || ""),
    logo: String(m.logo || ""),
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="caption mb-2">
          <Link href="/admin/customization" className="hover:text-ink">
            Customization
          </Link>{" "}
          → Icons
        </p>
        <h1 className="display-sm text-ink m-0 !text-[28px]">Category & store icons</h1>
      </div>
      <IconsManager categories={categories} stores={stores} />
    </div>
  );
}
