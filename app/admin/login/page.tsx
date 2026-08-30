"use client";

import { FormEvent, useState } from "react";
import { useAppRouter } from "@/lib/use-app-router";
import Link from "next/link";
import { LogoMark, ButtonPrimary, FeatureCard } from "@/components/ui";

export default function AdminLoginPage() {
  const router = useAppRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8">
        <LogoMark />
      </Link>
      <FeatureCard className="w-full max-w-sm !p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <h1 className="title-md text-ink m-0">Admin sign in</h1>
          <p className="caption mt-2 mb-0">
            Demo: <strong className="text-ink">admin</strong> /{" "}
            <strong className="text-ink">admin123</strong>
          </p>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="title-sm text-ink">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1.5 w-full h-12 px-4 text-sm bg-canvas border border-hairline rounded-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              autoComplete="username"
              required
            />
          </label>
          <label className="block">
            <span className="title-sm text-ink">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full h-12 px-4 text-sm bg-canvas border border-hairline rounded-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="text-sm text-error font-semibold m-0">{error}</p>}
          <ButtonPrimary type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </ButtonPrimary>
        </form>
      </FeatureCard>
      <Link href="/" className="mt-6 caption hover:text-primary">
        ← Back to site
      </Link>
    </div>
  );
}
