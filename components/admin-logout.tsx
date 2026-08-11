"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="block w-full text-left caption text-semantic-down px-3 py-2.5 rounded-lg hover:bg-white/10 font-semibold"
    >
      Log out
    </button>
  );
}
