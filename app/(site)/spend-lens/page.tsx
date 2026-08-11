import { SpendLensPanel } from "@/components/spend-lens-panel";
import { SpendLensLoginRewards } from "@/components/spend-lens-login-rewards";
import { ConnectMoreStores } from "@/components/connect-more-stores";

export const metadata = {
  title: "Spend Lens",
};

export default function SpendLensPage() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pt-6 font-metropolis">
      <SpendLensPanel />
      <SpendLensLoginRewards />
      <ConnectMoreStores />
    </section>
  );
}
