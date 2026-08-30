"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function RoutePrefetcher({ routes }: { routes: string[] }) {
  const router = useRouter();
  const prefetchedRef = useRef(new Set<string>());

  useEffect(() => {
    const uniqueRoutes = [...new Set(routes.filter(Boolean))];
    if (uniqueRoutes.length === 0) return;

    const prefetchAll = () => {
      for (const route of uniqueRoutes) {
        if (prefetchedRef.current.has(route)) continue;
        prefetchedRef.current.add(route);
        router.prefetch(route);
      }
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(prefetchAll, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = window.setTimeout(prefetchAll, 400);
    return () => window.clearTimeout(timer);
  }, [router, routes]);

  return null;
}
