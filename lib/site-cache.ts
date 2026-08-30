export const SITE_REVALIDATE = 300;

export const SITE_CACHE_TAGS = {
  nav: "site-nav",
  home: "site-home",
  merchants: "site-merchants",
  merchant: (slug: string) => `site-merchant:${slug}`,
  categories: "site-categories",
  category: (slug: string) => `site-category:${slug}`,
  stores: "site-stores",
  offers: "site-offers",
  customization: "site-customization",
} as const;
