import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

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

function getModel<T>(name: string, schema: Schema): Model<T> {
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema);
}

export type AdminDoc = InferSchemaType<typeof adminSchema> & { _id: mongoose.Types.ObjectId };
export type MerchantDoc = InferSchemaType<typeof merchantSchema> & { _id: mongoose.Types.ObjectId };
export type CategoryDoc = InferSchemaType<typeof categorySchema> & { _id: mongoose.Types.ObjectId };
export type OfferDoc = InferSchemaType<typeof offerSchema> & { _id: mongoose.Types.ObjectId };

export const Admin = getModel<AdminDoc>("Admin", adminSchema);
export const Merchant = getModel<MerchantDoc>("Merchant", merchantSchema);
export const Category = getModel<CategoryDoc>("Category", categorySchema);
export const Offer = getModel<OfferDoc>("Offer", offerSchema);
