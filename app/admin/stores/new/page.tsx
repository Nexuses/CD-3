import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { StoreForm } from "@/components/store-form";

export default async function NewStorePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="space-y-3">
      <h1 className="display-sm text-ink m-0 !text-[28px]">Add Store</h1>
      <StoreForm />
    </div>
  );
}
