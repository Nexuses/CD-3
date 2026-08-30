import { unstable_cache } from "next/cache";
import { connectDB } from "./mongodb";
import {
  Category,
  DealBanner,
  HeroSlide,
  Merchant,
  Offer,
} from "./models";
import type {
  DealBanner as DealBannerType,
  HeroSlide as HeroSlideType,
  HomeCategory,
  SpotlightCoupon,
} from "./home-banners";
import {
  defaultDealBanners,
  defaultHeroSlides,
  defaultHomeCategories,
  defaultSpotlightCoupons,
} from "./home-defaults";
import { SITE_CACHE_TAGS, SITE_REVALIDATE } from "./site-cache";

type LeanDoc = Record<string, unknown> & { _id?: unknown };

function str(value: unknown) {
  return value == null ? "" : String(value);
}

function mapHeroSlide(doc: LeanDoc): HeroSlideType {
  return {
    id: str(doc._id),
    name: str(doc.name),
    title: str(doc.title),
    description: str(doc.description),
    ctaLabel: str(doc.ctaLabel),
    href: str(doc.href),
    image: str(doc.image),
    alt: str(doc.alt),
  };
}

function mapDealBanner(doc: LeanDoc): DealBannerType {
  return {
    id: str(doc._id),
    title: str(doc.title),
    description: str(doc.description),
    ctaLabel: str(doc.ctaLabel),
    href: str(doc.href),
    image: str(doc.image),
    alt: str(doc.alt),
    logo: str(doc.logo) || undefined,
  };
}

function mapHomeCategory(doc: LeanDoc): HomeCategory {
  const slug = str(doc.slug);
  const homeHref = str(doc.homeHref);
  return {
    id: str(doc._id),
    name: str(doc.name),
    href: homeHref || `/category/${slug}`,
    image: str(doc.icon),
  };
}

export async function getHomePageContent() {
  return unstable_cache(loadHomePageContent, ["site-home-content"], {
    revalidate: SITE_REVALIDATE,
    tags: [
      SITE_CACHE_TAGS.home,
      SITE_CACHE_TAGS.customization,
      SITE_CACHE_TAGS.merchants,
      SITE_CACHE_TAGS.categories,
      SITE_CACHE_TAGS.offers,
    ],
  })();
}

async function loadHomePageContent() {
  await connectDB();

  const [heroDocs, categoryDocs, dealDocs, merchantSpotlight, offerSpotlight] =
    await Promise.all([
      HeroSlide.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 }).lean(),
      Category.find({ showOnHome: true }).sort({ homeOrder: 1, name: 1 }).lean(),
      DealBanner.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 }).lean(),
      Merchant.find({ isActive: true, isSpotlight: true })
        .sort({ spotlightOrder: 1, name: 1 })
        .lean(),
      Offer.find({ isActive: true, isSpotlight: true })
        .sort({ spotlightOrder: 1, createdAt: -1 })
        .populate("merchantId", "slug name logo")
        .lean(),
    ]);

  const heroSlides =
    heroDocs.length > 0 ? heroDocs.map(mapHeroSlide) : defaultHeroSlides();

  const homeCategories =
    categoryDocs.length > 0 ? categoryDocs.map(mapHomeCategory) : defaultHomeCategories();

  const dealBanners =
    dealDocs.length > 0 ? dealDocs.map(mapDealBanner) : defaultDealBanners();

  const spotlightFromMerchants: (SpotlightCoupon & { _order: number })[] =
    merchantSpotlight.map((m) => ({
      id: `merchant-${str(m._id)}`,
      name: `${str(m.name)} Coupons`,
      subtitle: str(m.spotlightSubtitle) || "Exclusive offers",
      href: `/${str(m.slug)}`,
      image: str(m.spotlightImage) || str(m.logo) || str(m.icon),
      _order: Number(m.spotlightOrder) || 0,
    }));

  const spotlightFromOffers: (SpotlightCoupon & { _order: number })[] = offerSpotlight.map(
    (o) => {
      const merchant =
        o.merchantId && typeof o.merchantId === "object" && "_id" in (o.merchantId as object)
          ? (o.merchantId as LeanDoc)
          : null;
      const merchantSlug = merchant ? str(merchant.slug) : "";
      return {
        id: `offer-${str(o._id)}`,
        name: str(o.title),
        subtitle: str(o.spotlightSubtitle) || str(o.subtitle) || str(o.discountLabel),
        href: merchantSlug ? `/${merchantSlug}#offer-${str(o._id)}` : "/stores",
        image:
          str(o.spotlightImage) ||
          (merchant ? str(merchant.logo) : "") ||
          "/images/home/spotlight/amazon.png",
        _order: Number(o.spotlightOrder) || 0,
      };
    },
  );

  const spotlightCoupons = [...spotlightFromMerchants, ...spotlightFromOffers]
    .sort((a, b) => a._order - b._order)
    .map(({ _order, ...item }) => item);

  const spotlight =
    spotlightCoupons.length > 0 ? spotlightCoupons : defaultSpotlightCoupons();

  return {
    heroSlides,
    homeCategories,
    spotlightCoupons: spotlight,
    dealBanners,
  };
}
