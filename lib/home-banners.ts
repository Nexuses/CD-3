export type HeroSlide = {
  id: string;
  name: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  image: string;
  alt: string;
};

export type HomeCategory = {
  id: string;
  name: string;
  href: string;
  image: string;
};

export type SpotlightCoupon = {
  id: string;
  name: string;
  subtitle: string;
  href: string;
  image: string;
};

export type DealBanner = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  image: string;
  alt: string;
};

export type RecommendedCard = {
  id: string;
  name: string;
  href: string;
  image: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "air-india",
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
    id: "amazon",
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
    id: "pineperks",
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
    id: "bgmi",
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
    id: "bigbasket",
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

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    id: "fashion",
    name: "Fashion & Lifestyle",
    href: "/category/fashion",
    image: "/images/home/categories/fashion.svg",
  },
  {
    id: "grocery",
    name: "Grocery",
    href: "/stores",
    image: "/images/home/categories/grocery.svg",
  },
  {
    id: "travel",
    name: "Travel",
    href: "/category/travel",
    image: "/images/home/categories/travel.svg",
  },
  {
    id: "jewellery",
    name: "Jewellery",
    href: "/stores",
    image: "/images/home/categories/jewellery.svg",
  },
  {
    id: "electronics",
    name: "Electronics & Appliances",
    href: "/category/appliances",
    image: "/images/home/categories/electronics.svg",
  },
  {
    id: "food",
    name: "Food & Beverages",
    href: "/category/food-dining",
    image: "/images/home/categories/food.svg",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    href: "/stores",
    image: "/images/home/categories/entertainment.svg",
  },
  {
    id: "health-beauty",
    name: "Health & Beauty",
    href: "/category/beauty-health",
    image: "/images/home/categories/health-beauty.svg",
  },
  {
    id: "home-needs",
    name: "Home Needs",
    href: "/category/home-furnishing",
    image: "/images/home/categories/home-needs.svg",
  },
  {
    id: "home-furnishings",
    name: "Home Furnishings",
    href: "/category/home-furnishing",
    image: "/images/home/categories/home-furnishings.svg",
  },
  {
    id: "sportswear",
    name: "Sportswear & Footwear",
    href: "/category/sports-fitness",
    image: "/images/home/categories/sportswear.svg",
  },
  {
    id: "books",
    name: "Books",
    href: "/stores",
    image: "/images/home/categories/books.svg",
  },
];

export const SPOTLIGHT_COUPONS: SpotlightCoupon[] = [
  {
    id: "amazon",
    name: "Amazon Shopping Coupons",
    subtitle: "Flat 1.75% Instant Off",
    href: "/amazon",
    image: "/images/home/spotlight/amazon.png",
  },
  {
    id: "myntra",
    name: "Myntra Coupons",
    subtitle: "Fashion & Lifestyle",
    href: "/myntra",
    image: "/images/home/spotlight/myntra.jpg",
  },
  {
    id: "flipkart",
    name: "Flipkart Coupons",
    subtitle: "Electronics & more",
    href: "/flipkart",
    image: "/images/home/spotlight/flipkart.png",
  },
  {
    id: "nykaa",
    name: "Nykaa Coupons",
    subtitle: "Beauty & Health",
    href: "/nykaa",
    image: "/images/home/spotlight/nykaa.png",
  },
  {
    id: "croma",
    name: "Croma Coupons",
    subtitle: "Electronics & Appliances",
    href: "/croma",
    image: "/images/home/spotlight/croma.png",
  },
  {
    id: "makemytrip",
    name: "MakeMyTrip Coupons",
    subtitle: "Travel deals",
    href: "/makemytrip",
    image: "/images/home/spotlight/makemytrip.png",
  },
  {
    id: "nike",
    name: "Nike Coupons",
    subtitle: "Sportswear & Footwear",
    href: "/nike",
    image: "/images/home/spotlight/nike.png",
  },
  {
    id: "bgmi",
    name: "BGMI UC Coupons",
    subtitle: "Flat 10% Off",
    href: "/category/computers-gaming",
    image: "/images/home/spotlight/bgmi.png",
  },
];

export const DEAL_BANNERS: DealBanner[] = [
  {
    id: "travel",
    title: "Upto 90% Instant off on Travel Coupons",
    description: "Verified coupons & cashback. Apply instantly.",
    ctaLabel: "Explore now!",
    href: "/category/travel",
    image: "/images/home/deals/travel.jpg",
    alt: "Upto 90% Instant off on Travel Coupons",
  },
  {
    id: "jewellery",
    title: "Upto 13% Instant Cashback on Jewellery",
    description: "Coupons & cashback — apply instantly",
    ctaLabel: "Explore now!",
    href: "/stores",
    image: "/images/home/deals/jewellery.png",
    alt: "Upto 13% Instant Cashback on Jewellery",
  },
];

export const RECOMMENDED_CARDS: RecommendedCard[] = [
  {
    id: "lenskart",
    name: "Lenskart Coupons",
    href: "/stores",
    image: "/images/home/recommended/lenskart.png",
  },
  {
    id: "valorant",
    name: "Valorant Coupons",
    href: "/category/computers-gaming",
    image: "/images/home/recommended/valorant.png",
  },
  {
    id: "steam",
    name: "Steam Coupons & Cashback",
    href: "/category/computers-gaming",
    image: "/images/home/recommended/steam.png",
  },
  {
    id: "roblox",
    name: "Roblox Coupons",
    href: "/category/computers-gaming",
    image: "/images/home/recommended/roblox.png",
  },
];
