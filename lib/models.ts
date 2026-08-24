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
    websiteUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const categorySchema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
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
  },
  { timestamps: true },
);

offerSchema.index({ merchantId: 1, isActive: 1 });
offerSchema.index({ type: 1, isActive: 1 });

function getModel(name: string, schema: Schema): Model<mongoose.Document> {
  return (mongoose.models[name] as Model<mongoose.Document>) || mongoose.model(name, schema);
}

export const Admin = getModel("Admin", adminSchema);
export const Merchant = getModel("Merchant", merchantSchema);
export const Category = getModel("Category", categorySchema);
export const Offer = getModel("Offer", offerSchema);
