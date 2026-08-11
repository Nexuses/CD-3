import { FeatureCard } from "@/components/ui";
import Link from "next/link";

export function StaticPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <h1 className="display-sm text-ink m-0 mb-8">{title}</h1>
      <FeatureCard>
        <div className="body-md space-y-4">{children}</div>
      </FeatureCard>
      <p className="mt-8 text-center">
        <Link href="/" className="btn-label text-fin-orange hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
