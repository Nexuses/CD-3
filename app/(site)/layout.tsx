import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";

export const dynamic = "force-dynamic";

async function getNavData() {
  const [categories, merchants] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
      include: { _count: { select: { offers: true } } },
    }),
    prisma.merchant.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      take: 12,
      include: {
        _count: { select: { offers: { where: { isActive: true } } } },
      },
    }),
  ]);

  return {
    categories,
    topStores: merchants.map((m) => ({
      id: m.id,
      slug: m.slug,
      name: m.name,
      logo: m.logo,
      offerCount: m._count.offers,
    })),
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories, topStores } = await getNavData();

  return (
    <>
      <SiteHeader categories={categories} topStores={topStores} />
      <main className="flex-1">{children}</main>
      <SiteFooter categories={categories} />
    </>
  );
}
