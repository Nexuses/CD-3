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
  logo?: string;
};

export type RecommendedCard = {
  id: string;
  name: string;
  href: string;
  image: string;
};
