"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { notifyNavigationStart } from "./navigation";

export function useAppRouter() {
  const router = useRouter();

  return useMemo(
    () => ({
      ...router,
      push: (href: string, options?: Parameters<typeof router.push>[1]) => {
        notifyNavigationStart();
        return router.push(href, options);
      },
      replace: (href: string, options?: Parameters<typeof router.replace>[1]) => {
        notifyNavigationStart();
        return router.replace(href, options);
      },
    }),
    [router],
  );
}
