"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({
  endpoint,
  redirectTo,
}: {
  endpoint: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        alert("Delete failed");
        return;
      }
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className="text-semantic-down font-semibold text-sm disabled:opacity-50"
    >
      {loading ? "…" : "Delete"}
    </button>
  );
}
