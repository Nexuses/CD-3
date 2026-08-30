import { revalidateTag } from "next/cache";
import { SITE_CACHE_TAGS } from "./site-cache";

export function revalidateSiteCache() {
  revalidateTag(SITE_CACHE_TAGS.nav);
  revalidateTag(SITE_CACHE_TAGS.home);
  revalidateTag(SITE_CACHE_TAGS.merchants);
  revalidateTag(SITE_CACHE_TAGS.categories);
  revalidateTag(SITE_CACHE_TAGS.stores);
  revalidateTag(SITE_CACHE_TAGS.offers);
  revalidateTag(SITE_CACHE_TAGS.customization);
}
