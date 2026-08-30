import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb";
import {
  DEFAULT_DEAL_BANNERS,
  DEFAULT_HERO_SLIDES,
  DEFAULT_SPOTLIGHT_BY_MERCHANT_SLUG,
  HOME_CATEGORY_SEEDS,
} from "../lib/home-defaults";
import { Admin, Category, DealBanner, HeroSlide, Merchant, Offer } from "../lib/models";

const BRAND_LOGOS: Record<string, string> = {
  amazon: "/logos/amazon.svg",
  flipkart: "/logos/flipkart.svg",
  myntra: "/logos/myntra.svg",
  ajio: "/logos/ajio.svg",
  jio: "/logos/jio.svg",
  nike: "/logos/nike.svg",
  swiggy: "/logos/swiggy.svg",
  boat: "/logos/boat.svg",
  makemytrip: "/logos/makemytrip.svg",
  nykaa: "/logos/nykaa.png",
  zomato: "/logos/zomato.png",
  croma: "/logos/croma.png",
  bewakoof: "/logos/bewakoof.png",
  "ajio-luxe": "/logos/ajio.svg",
};

function logo(slug: string, name: string, color: string) {
  if (BRAND_LOGOS[slug]) return BRAND_LOGOS[slug];
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="8" fill="${color}"/><text x="40" y="48" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#fff">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

async function main() {
  await connectDB();

  await Promise.all([
    Offer.deleteMany({}),
    Category.deleteMany({}),
    Merchant.deleteMany({}),
    Admin.deleteMany({}),
    HeroSlide.deleteMany({}),
    DealBanner.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("admin123", 10);
  await Admin.create({
    username: "admin",
    passwordHash,
    email: "admin@couponchrome.com",
  });

  const categoryData = [
    { slug: "fashion", name: "Fashion" },
    { slug: "beauty-health", name: "Beauty & Health" },
    { slug: "mobiles-tablets", name: "Mobiles & Tablets" },
    { slug: "appliances", name: "Appliances" },
    { slug: "travel", name: "Travel" },
    { slug: "computers-gaming", name: "Computers, Laptops & Gaming" },
    { slug: "food-dining", name: "Food & Dining" },
    { slug: "home-furnishing", name: "Home Furnishing" },
    { slug: "kids-toys", name: "Kids, Babies & Toys" },
    { slug: "sports-fitness", name: "Sports & Fitness" },
  ];

  const categories = await Category.insertMany(categoryData);
  const cat = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

  const extraCategoryData = [
    { slug: "grocery", name: "Grocery" },
    { slug: "jewellery", name: "Jewellery" },
    { slug: "entertainment", name: "Entertainment" },
    { slug: "books", name: "Books" },
    { slug: "home-furnishings", name: "Home Furnishings" },
  ];
  const extraCategories = await Category.insertMany(extraCategoryData);
  for (const c of extraCategories) {
    cat[c.slug] = c._id;
  }

  const merchantDefs = [
    { slug: "amazon", name: "Amazon", color: "#FF9900", websiteUrl: "https://www.amazon.in", description: "Shop millions of products across electronics, fashion, groceries, and more. Find verified Amazon coupons and deals updated daily.", featured: true },
    { slug: "flipkart", name: "Flipkart", color: "#2874F0", websiteUrl: "https://www.flipkart.com", description: "India's leading marketplace for mobiles, electronics, fashion, and home essentials with exclusive Flipkart deals.", featured: true },
    { slug: "myntra", name: "Myntra", color: "#FF3F6C", websiteUrl: "https://www.myntra.com", description: "Fashion destination for clothing, footwear, and accessories from top brands with seasonal sales.", featured: true },
    { slug: "ajio", name: "AJIO", color: "#2C2C2C", websiteUrl: "https://www.ajio.com", description: "Curated fashion and lifestyle from Reliance Retail with AJIO exclusive coupons.", featured: true },
    { slug: "jio", name: "Jio", color: "#0A2885", websiteUrl: "https://www.jio.com", description: "Reliance Jio prepaid, postpaid, and digital services with exclusive Jio coupons and offers.", featured: true },
    { slug: "nike", name: "Nike", color: "#111111", websiteUrl: "https://www.nike.com/in", description: "Just Do It — sneakers, apparel, and sports gear with Nike promo codes and sale deals.", featured: true },
    { slug: "nykaa", name: "Nykaa", color: "#FC2779", websiteUrl: "https://www.nykaa.com", description: "Beauty, makeup, and personal care from leading brands with Nykaa promo codes.", featured: true },
    { slug: "swiggy", name: "Swiggy", color: "#FC8019", websiteUrl: "https://www.swiggy.com", description: "Food delivery, Instamart groceries, and more — save with Swiggy deals.", featured: true },
    { slug: "zomato", name: "Zomato", color: "#E23744", websiteUrl: "https://www.zomato.com", description: "Order food from restaurants near you with Zomato coupon codes.", featured: false },
    { slug: "makemytrip", name: "MakeMyTrip", color: "#53B2DF", websiteUrl: "https://www.makemytrip.com", description: "Flights, hotels, and holiday packages with MakeMyTrip offers.", featured: true },
    { slug: "croma", name: "Croma", color: "#1A1A1A", websiteUrl: "https://www.croma.com", description: "Electronics and appliances from Tata's Croma with exclusive deals.", featured: false },
    { slug: "bewakoof", name: "Bewakoof", color: "#42A2A2", websiteUrl: "https://www.bewakoof.com", description: "Trendy graphic tees and casual wear with Bewakoof discount codes.", featured: false },
    { slug: "ajio-luxe", name: "AJIO Luxe", color: "#8B7355", websiteUrl: "https://www.ajio.com/luxe", description: "Premium and luxury fashion brands on AJIO Luxe.", featured: false },
    { slug: "boat", name: "boAt", color: "#E41E26", websiteUrl: "https://www.boat-lifestyle.com", description: "Audio gear, wearables, and accessories with boAt offers.", featured: true },
  ];

  const merchants = await Merchant.insertMany(
    merchantDefs.map((m) => ({
      slug: m.slug,
      name: m.name,
      logo: logo(m.slug, m.name, m.color),
      websiteUrl: m.websiteUrl,
      description: m.description,
      seoTitle: `${m.name} Coupons & Offers — Clicks 4 Coupon`,
      seoDescription: m.description,
      isActive: true,
      isFeatured: m.featured,
    })),
  );
  const merch = Object.fromEntries(merchants.map((m) => [m.slug, m]));

  type OfferSeed = {
    merchant: string;
    type: "coupon" | "deal";
    title: string;
    subtitle: string;
    terms: string;
    code?: string;
    discount: string;
    exclusive?: boolean;
    cats: string[];
    banks?: string[];
    clicks?: number;
  };

  const offers: OfferSeed[] = [
    { merchant: "amazon", type: "deal", title: "G.O.A.T. Sale: Up to 90% Off", subtitle: "Electronics, fashion & more on Amazon Great Indian Festival style deals", terms: "Valid on selected products. Offer ends soon. T&C apply.", discount: "UPTO 90% OFF", cats: ["mobiles-tablets", "fashion", "appliances"], banks: ["HDFC", "ICICI"], clicks: 1240 },
    { merchant: "amazon", type: "coupon", title: "Flat ₹100 off on Grocery", subtitle: "Min order ₹499 on Amazon Fresh & Pantry", terms: "One use per customer. Valid on grocery category only.", code: "FRESH100", discount: "FLAT ₹100 OFF", cats: ["food-dining"], banks: ["Amazon Pay"], clicks: 890 },
    { merchant: "amazon", type: "deal", title: "Mobiles Starting ₹6,999", subtitle: "Best sellers under mega sale prices", terms: "While stocks last. Bank EMI offers available.", discount: "FROM ₹6999", cats: ["mobiles-tablets"], banks: ["SBI", "Axis"], clicks: 2100 },
    { merchant: "amazon", type: "coupon", title: "Extra 10% Off Electronics", subtitle: "Use code at checkout on eligible electronics", terms: "Max discount ₹1500. Not valid with other coupons.", code: "ELEC10", discount: "EXTRA 10% OFF", exclusive: true, cats: ["computers-gaming", "appliances"], clicks: 560 },
    { merchant: "flipkart", type: "deal", title: "Big Billion Days Preview Deals", subtitle: "Early access prices on fashion & electronics", terms: "Prices subject to change. Limited stock.", discount: "UPTO 80% OFF", cats: ["fashion", "mobiles-tablets"], banks: ["Flipkart Axis", "SBI"], clicks: 3400 },
    { merchant: "flipkart", type: "coupon", title: "₹200 Off on Fashion", subtitle: "Min cart value ₹999", terms: "Valid on apparel & footwear. One per user.", code: "STYLE200", discount: "FLAT ₹200 OFF", cats: ["fashion"], clicks: 780 },
    { merchant: "flipkart", type: "deal", title: "Laptop Fest — Up to ₹20,000 Off", subtitle: "HP, Lenovo, Dell & more", terms: "Exchange offers may apply separately.", discount: "UPTO ₹20K OFF", cats: ["computers-gaming"], banks: ["HDFC", "ICICI"], clicks: 1500 },
    { merchant: "flipkart", type: "deal", title: "Home Appliances Mega Sale", subtitle: "ACs, refrigerators & washing machines", terms: "Installation charges may apply.", discount: "UPTO 55% OFF", cats: ["appliances", "home-furnishing"], clicks: 920 },
    { merchant: "myntra", type: "coupon", title: "Flat 90% OFF — All Users", subtitle: "End of Reason Sale preview styles", terms: "Selected products only. No coupon stacking.", code: "MYNTRA90", discount: "FLAT 90% OFF", exclusive: true, cats: ["fashion"], clicks: 5200 },
    { merchant: "myntra", type: "deal", title: "90% Off on Fashion", subtitle: "Thousands of styles under clearance", terms: "While stocks last.", discount: "UPTO 90% OFF", cats: ["fashion"], clicks: 4100 },
    { merchant: "myntra", type: "coupon", title: "Extra ₹300 Off First Order", subtitle: "New Myntra users only", terms: "Min purchase ₹1499. App & web.", code: "FIRST300", discount: "FLAT ₹300 OFF", cats: ["fashion"], banks: ["Paytm"], clicks: 1100 },
    { merchant: "myntra", type: "deal", title: "Beauty Bonanza", subtitle: "Makeup & skincare from top brands", terms: "Free shipping above ₹499.", discount: "UPTO 60% OFF", cats: ["beauty-health", "fashion"], clicks: 640 },
    { merchant: "ajio", type: "deal", title: "Reliance Days — Up to 80% Off", subtitle: "AJIO fashion & lifestyle blowout", terms: "Selected brands. Offer period limited.", discount: "UPTO 80% OFF", cats: ["fashion"], banks: ["ICICI", "Axis"], clicks: 2800 },
    { merchant: "ajio", type: "coupon", title: "Extra 20% Off Sitewide", subtitle: "Use code on eligible styles", terms: "Max discount ₹2000. Exclusions apply.", code: "AJIO20", discount: "EXTRA 20% OFF", exclusive: true, cats: ["fashion"], clicks: 1900 },
    { merchant: "ajio", type: "coupon", title: "₹500 Off on Orders Above ₹2499", subtitle: "Valid on clothing & accessories", terms: "One use per account this month.", code: "SAVE500", discount: "FLAT ₹500 OFF", cats: ["fashion"], clicks: 870 },
    { merchant: "ajio", type: "deal", title: "Footwear Fiesta", subtitle: "Sneakers, sandals & formal shoes", terms: "Size availability varies.", discount: "UPTO 70% OFF", cats: ["fashion", "sports-fitness"], clicks: 430 },
    { merchant: "nike", type: "deal", title: "Members Get Extra 20% Off", subtitle: "On full-price styles for Nike Members", terms: "Sign in required. Exclusions apply.", discount: "EXTRA 20% OFF", exclusive: true, cats: ["fashion", "sports-fitness"], clicks: 2800 },
    { merchant: "nike", type: "coupon", title: "Flat ₹500 Off Footwear", subtitle: "Min purchase ₹2999 on select sneakers", terms: "One use per member. App & web.", code: "NIKE500", discount: "FLAT ₹500 OFF", cats: ["fashion", "sports-fitness"], banks: ["HDFC"], clicks: 1600 },
    { merchant: "nike", type: "deal", title: "Clearance Up to 50% Off", subtitle: "Apparel, shoes & accessories", terms: "While stocks last. Final sale items excluded from returns.", discount: "UPTO 50% OFF", cats: ["fashion", "sports-fitness"], clicks: 2100 },
    { merchant: "nykaa", type: "coupon", title: "Flat 15% Off Beauty", subtitle: "Min order ₹899 on Nykaa", terms: "Not valid on already discounted items.", code: "BEAUTY15", discount: "FLAT 15% OFF", cats: ["beauty-health"], banks: ["HDFC", "Paytm"], clicks: 1600 },
    { merchant: "nykaa", type: "deal", title: "Buy 2 Get 1 Free Makeup", subtitle: "Selected makeup SKUs", terms: "Lowest priced item free.", discount: "B2G1 FREE", cats: ["beauty-health"], clicks: 980 },
    { merchant: "nykaa", type: "coupon", title: "₹200 Off Skincare", subtitle: "Min cart ₹1299", terms: "Valid once per user.", code: "SKIN200", discount: "FLAT ₹200 OFF", exclusive: true, cats: ["beauty-health"], clicks: 720 },
    { merchant: "swiggy", type: "coupon", title: "60% Off Up to ₹120", subtitle: "On food orders above ₹199", terms: "Valid for selected restaurants. One per day.", code: "SWIGGYIT", discount: "UPTO 60% OFF", cats: ["food-dining"], banks: ["Google Pay", "Paytm"], clicks: 6500 },
    { merchant: "swiggy", type: "deal", title: "Instamart Free Delivery", subtitle: "On orders above ₹199", terms: "Selected cities. Peak hours excluded.", discount: "FREE DELIVERY", cats: ["food-dining"], clicks: 2200 },
    { merchant: "swiggy", type: "coupon", title: "₹100 Off First Instamart Order", subtitle: "New Instamart users", terms: "Min order ₹299.", code: "INSTA100", discount: "FLAT ₹100 OFF", cats: ["food-dining"], clicks: 1400 },
    { merchant: "zomato", type: "coupon", title: "50% Off Up to ₹100", subtitle: "On your next order", terms: "Valid restaurants only. Max one redemption/day.", code: "ZOMATO50", discount: "UPTO 50% OFF", cats: ["food-dining"], banks: ["Paytm", "PhonePe"], clicks: 4800 },
    { merchant: "zomato", type: "deal", title: "Gold Membership Special", subtitle: "Extra discounts for Gold members", terms: "Requires active Gold subscription.", discount: "GOLD EXTRA", cats: ["food-dining"], clicks: 310 },
    { merchant: "makemytrip", type: "coupon", title: "Flat ₹1500 Off Domestic Flights", subtitle: "Min fare ₹4500", terms: "Valid on select airlines. Blackout dates apply.", code: "FLY1500", discount: "FLAT ₹1500 OFF", cats: ["travel"], banks: ["HDFC", "SBI", "Axis"], clicks: 980 },
    { merchant: "makemytrip", type: "deal", title: "Hotels Up to 60% Off", subtitle: "Domestic hotel stays", terms: "Non-refundable rates may apply.", discount: "UPTO 60% OFF", cats: ["travel"], clicks: 760 },
    { merchant: "makemytrip", type: "coupon", title: "₹800 Off International Hotels", subtitle: "Min booking ₹8000", terms: "Valid for stays outside India.", code: "INTL800", discount: "FLAT ₹800 OFF", exclusive: true, cats: ["travel"], banks: ["ICICI"], clicks: 420 },
    { merchant: "croma", type: "deal", title: "TV Fest — Up to 40% Off", subtitle: "Smart TVs from leading brands", terms: "Exchange bonus available on select models.", discount: "UPTO 40% OFF", cats: ["appliances", "computers-gaming"], banks: ["HDFC", "Kotak"], clicks: 540 },
    { merchant: "croma", type: "coupon", title: "Extra ₹1000 Off Laptops", subtitle: "Min purchase ₹40,000", terms: "In-store & online. One per customer.", code: "LAPTOP1K", discount: "FLAT ₹1000 OFF", cats: ["computers-gaming"], clicks: 290 },
    { merchant: "bewakoof", type: "coupon", title: "Buy 3 Get 1 Free Tees", subtitle: "On graphic & plain tees", terms: "Lowest priced free. Code required.", code: "B3G1", discount: "B3G1 FREE", cats: ["fashion"], clicks: 1800 },
    { merchant: "bewakoof", type: "deal", title: "Clearance Under ₹399", subtitle: "Hundreds of styles", terms: "While stocks last.", discount: "UNDER ₹399", cats: ["fashion"], clicks: 950 },
    { merchant: "boat", type: "coupon", title: "Flat 20% Off Audio", subtitle: "Headphones, earbuds & speakers", terms: "Max discount ₹2000.", code: "BOAT20", discount: "FLAT 20% OFF", cats: ["mobiles-tablets", "computers-gaming"], banks: ["Paytm", "Google Pay"], clicks: 2100 },
    { merchant: "boat", type: "deal", title: "Smartwatches From ₹999", subtitle: "boAt Watch series sale", terms: "Selected models only.", discount: "FROM ₹999", cats: ["mobiles-tablets", "sports-fitness"], clicks: 1300 },
    { merchant: "ajio-luxe", type: "deal", title: "Luxury Brands Up to 50% Off", subtitle: "Premium labels on AJIO Luxe", terms: "Authenticity guaranteed. Limited period.", discount: "UPTO 50% OFF", cats: ["fashion"], clicks: 180 },
    { merchant: "amazon", type: "deal", title: "HDFC Bank 10% Instant Discount", subtitle: "On select electronics with HDFC cards", terms: "Min transaction ₹5000. Max discount ₹1500.", discount: "10% BANK OFF", cats: ["appliances", "mobiles-tablets"], banks: ["HDFC"], clicks: 670 },
    { merchant: "flipkart", type: "deal", title: "SBI Card Extra 5% Off", subtitle: "On fashion & lifestyle", terms: "Valid SBI credit cards only.", discount: "5% BANK OFF", cats: ["fashion"], banks: ["SBI"], clicks: 410 },
    { merchant: "myntra", type: "coupon", title: "Kids Wear Extra 25% Off", subtitle: "Min 2 kids items", terms: "Excludes already heavily discounted items.", code: "KIDS25", discount: "EXTRA 25% OFF", cats: ["kids-toys", "fashion"], clicks: 380 },
    { merchant: "amazon", type: "deal", title: "Home Decor Mega Deals", subtitle: "Furniture, bedding & decor", terms: "Delivery timelines vary by pin code.", discount: "UPTO 65% OFF", cats: ["home-furnishing"], clicks: 520 },
    { merchant: "nykaa", type: "deal", title: "Fragrance Fest", subtitle: "Perfumes from global brands", terms: "Tester sizes excluded.", discount: "UPTO 40% OFF", cats: ["beauty-health"], clicks: 290 },
    { merchant: "swiggy", type: "deal", title: "Paytm Wallet Cashback Day", subtitle: "Extra savings when paying via Paytm", terms: "Wallet must have sufficient balance.", discount: "WALLET BONUS", cats: ["food-dining"], banks: ["Paytm"], clicks: 1100 },
    { merchant: "makemytrip", type: "deal", title: "Weekend Getaways from ₹1999", subtitle: "Hotel + flight combos", terms: "Package inclusions vary.", discount: "FROM ₹1999", cats: ["travel"], clicks: 640 },
    { merchant: "croma", type: "deal", title: "Kitchen Appliances Sale", subtitle: "Mixers, air fryers & more", terms: "Warranty as per brand.", discount: "UPTO 45% OFF", cats: ["appliances", "home-furnishing"], banks: ["Axis"], clicks: 310 },
    { merchant: "bewakoof", type: "coupon", title: "Free Shipping Code", subtitle: "No min order this week", terms: "India shipping only.", code: "FREESHIP", discount: "FREE SHIP", cats: ["fashion"], clicks: 700 },
    { merchant: "boat", type: "coupon", title: "Student Extra 5% Off", subtitle: "Verify student ID at checkout", terms: "Valid student email required.", code: "STUDENT5", discount: "EXTRA 5% OFF", exclusive: true, cats: ["mobiles-tablets"], clicks: 250 },
    { merchant: "amazon", type: "coupon", title: "Books Flat ₹50 Off", subtitle: "Min 2 books in cart", terms: "Excludes Kindle editions.", code: "READ50", discount: "FLAT ₹50 OFF", cats: ["kids-toys"], clicks: 190 },
    { merchant: "flipkart", type: "coupon", title: "Fitness Gear ₹250 Off", subtitle: "Min purchase ₹1499", terms: "Valid on sports equipment.", code: "FIT250", discount: "FLAT ₹250 OFF", cats: ["sports-fitness"], banks: ["PhonePe"], clicks: 340 },
    { merchant: "ajio", type: "deal", title: "Winter Wear Early Bird", subtitle: "Jackets, sweaters & thermals", terms: "Seasonal collection.", discount: "UPTO 75% OFF", cats: ["fashion"], clicks: 880 },
    { merchant: "zomato", type: "coupon", title: "Lunch Special ₹75 Off", subtitle: "Orders between 12–3 PM", terms: "Min order ₹249. Weekdays only.", code: "LUNCH75", discount: "FLAT ₹75 OFF", cats: ["food-dining"], clicks: 1500 },
  ];

  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + 2);

  for (const o of offers) {
    const m = merch[o.merchant];
    if (!m) continue;
    await Offer.create({
      merchantId: m._id,
      type: o.type,
      title: o.title,
      subtitle: o.subtitle,
      terms: o.terms,
      couponCode: o.code ?? null,
      affiliateUrl: `${m.websiteUrl}?ref=couponchrome`,
      discountLabel: o.discount,
      isExclusive: o.exclusive ?? false,
      expiryDate: expiry,
      isActive: true,
      clickCount: o.clicks ?? Math.floor(Math.random() * 500),
      categoryIds: o.cats.filter((slug) => cat[slug]).map((slug) => cat[slug]),
      bankTags: o.banks ?? [],
    });
  }

  for (const seed of HOME_CATEGORY_SEEDS) {
    const update: Record<string, unknown> = {
      icon: seed.icon,
      showOnHome: true,
      homeOrder: seed.homeOrder,
      homeHref: seed.href,
    };
    if (seed.name) update.name = seed.name;
    await Category.updateOne({ slug: seed.slug }, { $set: update });
  }

  await HeroSlide.insertMany(
    DEFAULT_HERO_SLIDES.map((slide, index) => ({
      ...slide,
      sortOrder: index,
      isActive: true,
    })),
  );

  await DealBanner.insertMany(
    DEFAULT_DEAL_BANNERS.map((banner, index) => ({
      ...banner,
      sortOrder: index,
      isActive: true,
    })),
  );

  for (const [slug, cfg] of Object.entries(DEFAULT_SPOTLIGHT_BY_MERCHANT_SLUG)) {
    await Merchant.updateOne(
      { slug },
      {
        $set: {
          isSpotlight: true,
          spotlightImage: cfg.image,
          spotlightSubtitle: cfg.subtitle,
          spotlightOrder: cfg.order,
        },
      },
    );
  }

  const heroCount = await HeroSlide.countDocuments();
  const dealCount = await DealBanner.countDocuments();

  console.log("Seed complete:");
  console.log("  Admin: admin / admin123");
  console.log(`  Merchants: ${merchants.length}`);
  console.log(`  Categories: ${categories.length + extraCategories.length}`);
  console.log(`  Offers: ${offers.length}`);
  console.log(`  Hero slides: ${heroCount}`);
  console.log(`  Deal banners: ${dealCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    const mongoose = await import("mongoose");
    await mongoose.disconnect();
  });
