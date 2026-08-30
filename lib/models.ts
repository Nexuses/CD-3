import mongoose, { Schema, type Model } from "mongoose";

const adminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const merchantSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    logo: { type: String, default: "" },
    icon: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isSpotlight: { type: Boolean, default: false },
    spotlightImage: { type: String, default: "" },
    spotlightSubtitle: { type: String, default: "" },
    spotlightOrder: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const categorySchema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  icon: { type: String, default: "" },
  showOnHome: { type: Boolean, default: false },
  homeOrder: { type: Number, default: 0 },
  homeHref: { type: String, default: "" },
});

const offerSchema = new Schema(
  {
    merchantId: { type: Schema.Types.ObjectId, ref: "Merchant", required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    terms: { type: String, default: "" },
    couponCode: { type: String, default: null },
    affiliateUrl: { type: String, required: true },
    discountLabel: { type: String, default: "" },
    isExclusive: { type: Boolean, default: false },
    startDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    clickCount: { type: Number, default: 0 },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    bankTags: [{ type: String }],
    isSpotlight: { type: Boolean, default: false },
    spotlightImage: { type: String, default: "" },
    spotlightSubtitle: { type: String, default: "" },
    spotlightOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const heroSlideSchema = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    ctaLabel: { type: String, default: "Explore now" },
    href: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const dealBannerSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    ctaLabel: { type: String, default: "Explore now!" },
    href: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String, default: "" },
    logo: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

offerSchema.index({ merchantId: 1, isActive: 1 });
offerSchema.index({ type: 1, isActive: 1 });
offerSchema.index({ isSpotlight: 1, spotlightOrder: 1 });
merchantSchema.index({ isSpotlight: 1, spotlightOrder: 1 });
categorySchema.index({ showOnHome: 1, homeOrder: 1 });

function getModel(name: string, schema: Schema): Model<mongoose.Document> {
  return (mongoose.models[name] as Model<mongoose.Document>) || mongoose.model(name, schema);
}

export const Admin = getModel("Admin", adminSchema);
export const Merchant = getModel("Merchant", merchantSchema);
export const Category = getModel("Category", categorySchema);
export const Offer = getModel("Offer", offerSchema);
export const HeroSlide = getModel("HeroSlide", heroSlideSchema);
export const DealBanner = getModel("DealBanner", dealBannerSchema);
