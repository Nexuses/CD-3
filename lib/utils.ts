export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function usedTodayFromClicks(clickCount: number): number {
  // Deterministic "used today" social proof from total clicks
  return Math.max(1, Math.floor(clickCount * 0.08) + (clickCount % 47));
}

export type OfferWithRelations = {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  terms: string;
  couponCode: string | null;
  affiliateUrl: string;
  discountLabel: string;
  isExclusive: boolean;
  clickCount: number;
  expiryDate: Date | null;
  merchant: {
    id: number;
    slug: string;
    name: string;
    logo: string;
  };
  bankTags?: { tagName: string }[];
  categories?: { category: { id: number; slug: string; name: string } }[];
};
