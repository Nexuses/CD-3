import { RoutePrefetcher } from "@/components/route-prefetcher";
import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import { getNavData } from "@/lib/site-data";

export const revalidate = 300;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories, topStores } = await getNavData();

  const prefetchRoutes = [
    "/stores",
    ...topStores.slice(0, 8).map((store) => `/${store.slug}`),
    ...categories.slice(0, 6).map((category) => `/category/${category.slug}`),
  ];

  return (
    <>
      <RoutePrefetcher routes={prefetchRoutes} />
      <SiteHeader categories={categories} topStores={topStores} />
      <main className="flex-1">{children}</main>
      <SiteFooter categories={categories} />
    </>
  );
}
