import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DealBannerForm } from "@/components/customization/deal-banner-form";

export default async function NewDealBannerPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="space-y-3">
      <p className="caption mb-2">
        <Link href="/admin/customization" className="hover:text-ink">
          Customization
        </Link>{" "}
        →{" "}
        <Link href="/admin/customization/deals" className="hover:text-ink">
          Deals
        </Link>{" "}
        → New
      </p>
      <h1 className="display-sm text-ink m-0 !text-[28px]">Add deal banner</h1>
      <DealBannerForm />
    </div>
  );
}
