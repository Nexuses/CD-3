import type {
  DealBanner,
  HeroSlide,
  HomeCategory,
  RecommendedCard,
  SpotlightCoupon,
} from "./home-banners";

export const DEFAULT_HERO_SLIDES: Omit<HeroSlide, "id">[] = [
  {
    name: "AirIndia",
    title: "Upto 20% Off on Air India Coupons",
    description:
      "Save big on the trip you've been planning. A little planning, a lot less spending.",
    ctaLabel: "Explore now",
    href: "/stores",
    image: "/images/home/hero/air-india.png",
    alt: "Air India coupons and cashback offers",
  },
  {
    name: "ASV",
    title: "Flat 1.75% Instant Cashback",
    description:
      "On Amazon Shopping Coupons. Enjoy extra savings on Amazon Great Freedom Sale.",
    ctaLabel: "Get yours today",
    href: "/amazon",
    image: "/images/home/hero/amazon.png",
    alt: "Discount on Amazon shopping coupons",
  },
  {
    name: "Pineperks Rupay",
    title: "Flat 1.5% Cashback on PinePerks RuPay",
    description:
      "Use across websites that accept RuPay* & save extra 1.5% cashback on every purchase.",
    ctaLabel: "Buy now",
    href: "/stores",
    image: "/images/home/hero/pineperks.jpg",
    alt: "Cashback on RuPay offers",
  },
  {
    name: "bgmi",
    title: "Flat 10% Off on BGMI UC Coupons",
    description:
      "The first X-Suit with three upgradable forms. Claim yours using BGMI UC Coupons and save 10%!",
    ctaLabel: "Buy now",
    href: "/category/computers-gaming",
    image: "/images/home/hero/bgmi.png",
    alt: "BGMI coupon offer",
  },
  {
    name: "Big Basket",
    title: "Flat 4% Instant Cashback",
    description:
      "Shop with bigbasket coupons and save extra on your groceries. Apply instantly.",
    ctaLabel: "Buy now",
    href: "/stores",
    image: "/images/home/hero/bigbasket.jpg",
    alt: "Bigbasket coupons and cashback",
  },
];

export type HomeCategorySeed = {
  slug: string;
  name: string;
  href: string;
  icon: string;
  homeOrder: number;
};

export const HOME_CATEGORY_SEEDS: HomeCategorySeed[] = [
  { slug: "fashion", name: "Fashion & Lifestyle", href: "/category/fashion", icon: "/images/home/categories/fashion.svg", homeOrder: 1 },
  { slug: "grocery", name: "Grocery", href: "/stores", icon: "/images/home/categories/grocery.svg", homeOrder: 2 },
  { slug: "travel", name: "Travel", href: "/category/travel", icon: "/images/home/categories/travel.svg", homeOrder: 3 },
  { slug: "jewellery", name: "Jewellery", href: "/stores", icon: "/images/home/categories/jewellery.svg", homeOrder: 4 },
  { slug: "appliances", name: "Electronics & Appliances", href: "/category/appliances", icon: "/images/home/categories/electronics.svg", homeOrder: 5 },
  { slug: "food-dining", name: "Food & Beverages", href: "/category/food-dining", icon: "/images/home/categories/food.svg", homeOrder: 6 },
  { slug: "entertainment", name: "Entertainment", href: "/stores", icon: "/images/home/categories/entertainment.svg", homeOrder: 7 },
  { slug: "beauty-health", name: "Health & Beauty", href: "/category/beauty-health", icon: "/images/home/categories/health-beauty.svg", homeOrder: 8 },
  { slug: "home-furnishing", name: "Home Needs", href: "/category/home-furnishing", icon: "/images/home/categories/home-needs.svg", homeOrder: 9 },
  { slug: "home-furnishings", name: "Home Furnishings", href: "/category/home-furnishing", icon: "/images/home/categories/home-furnishings.svg", homeOrder: 10 },
  { slug: "sports-fitness", name: "Sportswear & Footwear", href: "/category/sports-fitness", icon: "/images/home/categories/sportswear.svg", homeOrder: 11 },
  { slug: "books", name: "Books", href: "/stores", icon: "/images/home/categories/books.svg", homeOrder: 12 },
];

export const DEFAULT_SPOTLIGHT_BY_MERCHANT_SLUG: Record<
  string,
  { subtitle: string; image: string; order: number }
> = {
  amazon: { subtitle: "Flat 1.75% Instant Off", image: "/images/home/spotlight/amazon.png", order: 1 },
  myntra: { subtitle: "Fashion & Lifestyle", image: "/images/home/spotlight/myntra.jpg", order: 2 },
  flipkart: { subtitle: "Electronics & more", image: "/images/home/spotlight/flipkart.png", order: 3 },
  nykaa: { subtitle: "Beauty & Health", image: "/images/home/spotlight/nykaa.png", order: 4 },
  croma: { subtitle: "Electronics & Appliances", image: "/images/home/spotlight/croma.png", order: 5 },
  makemytrip: { subtitle: "Travel deals", image: "/images/home/spotlight/makemytrip.png", order: 6 },
  nike: { subtitle: "Sportswear & Footwear", image: "/images/home/spotlight/nike.png", order: 7 },
};

export const DEFAULT_SPOTLIGHT_BGMI = {
  name: "BGMI UC Coupons",
  subtitle: "Flat 10% Off",
  href: "/category/computers-gaming",
  image: "/images/home/spotlight/bgmi.png",
  order: 8,
};

export const DEFAULT_DEAL_BANNERS: Omit<DealBanner, "id">[] = [
  {
    title: "Upto 90% Instant off on Travel Coupons",
    description: "Verified coupons & cashback. Apply instantly.",
    ctaLabel: "Explore now!",
    href: "/category/travel",
    image: "/images/home/deals/travel.jpg",
    alt: "Upto 90% Instant off on Travel Coupons",
    logo: "",
  },
  {
    title: "Upto 13% Instant Cashback on Jewellery",
    description: "Coupons & cashback — apply instantly",
    ctaLabel: "Explore now!",
    href: "/stores",
    image: "/images/home/deals/jewellery.png",
    alt: "Upto 13% Instant Cashback on Jewellery",
    logo: "",
  },
];

export const RECOMMENDED_CARDS: RecommendedCard[] = [
  { id: "lenskart", name: "Lenskart Coupons", href: "/stores", image: "/images/home/recommended/lenskart.png" },
  { id: "valorant", name: "Valorant Coupons", href: "/category/computers-gaming", image: "/images/home/recommended/valorant.png" },
  { id: "steam", name: "Steam Coupons & Cashback", href: "/category/computers-gaming", image: "/images/home/recommended/steam.png" },
  { id: "roblox", name: "Roblox Coupons", href: "/category/computers-gaming", image: "/images/home/recommended/roblox.png" },
];

export function defaultHomeCategories(): HomeCategory[] {
  return HOME_CATEGORY_SEEDS.map((c) => ({
    id: c.slug,
    name: c.name,
    href: c.href,
    image: c.icon,
  }));
}

export function defaultHeroSlides(): HeroSlide[] {
  return DEFAULT_HERO_SLIDES.map((s, i) => ({ ...s, id: `default-hero-${i}` }));
}

export function defaultDealBanners(): DealBanner[] {
  return DEFAULT_DEAL_BANNERS.map((d, i) => ({ ...d, id: `default-deal-${i}` }));
}

export function defaultSpotlightCoupons(): SpotlightCoupon[] {
  const storeItems: SpotlightCoupon[] = Object.entries(DEFAULT_SPOTLIGHT_BY_MERCHANT_SLUG).map(
    ([slug, cfg]) => ({
      id: `merchant-${slug}`,
      name: `${slug.charAt(0).toUpperCase()}${slug.slice(1)} Coupons`,
      subtitle: cfg.subtitle,
      href: `/${slug}`,
      image: cfg.image,
    }),
  );
  storeItems.push({
    id: "bgmi",
    name: DEFAULT_SPOTLIGHT_BGMI.name,
    subtitle: DEFAULT_SPOTLIGHT_BGMI.subtitle,
    href: DEFAULT_SPOTLIGHT_BGMI.href,
    image: DEFAULT_SPOTLIGHT_BGMI.image,
  });
  return storeItems;
}
