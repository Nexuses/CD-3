import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoMark } from "@/components/ui";
import { AdminLogoutButton } from "@/components/admin-logout";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/stores", label: "Stores" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/customization", label: "Customization" },
];

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface-soft flex flex-col md:flex-row">
      <aside className="bg-surface-dark text-on-dark md:w-56 shrink-0 md:min-h-screen">
        <div className="p-5 border-b border-white/10">
          <Link href="/admin/dashboard">
            <LogoMark onDark />
          </Link>
          <p className="caption text-on-dark-soft mt-3 mb-0">Admin · {session.username}</p>
        </div>
        <nav className="p-3 space-y-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block nav-link text-on-dark px-3 py-2.5 rounded-lg hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="block caption text-on-dark-soft px-3 py-2.5 hover:text-on-dark"
          >
            ← View site
          </Link>
          <AdminLogoutButton />
        </nav>
      </aside>
      <div className="flex-1 p-6 md:p-8 max-w-5xl">{children}</div>
    </div>
  );
}
