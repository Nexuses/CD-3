"use client";

import { NAVIGATION_START_EVENT } from "@/lib/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function shouldHandleLink(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return false;
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;

  if (href.startsWith("http")) {
    try {
      return new URL(href).origin === window.location.origin;
    } catch {
      return false;
    }
  }

  return true;
}

function isSameDestination(href: string, pathname: string, search: string) {
  try {
    const url = new URL(href, window.location.origin);
    const nextSearch = url.search || "";
    return url.pathname === pathname && nextSearch === search;
  } catch {
    return false;
  }
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef(false);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (hideRef.current) {
      clearTimeout(hideRef.current);
      hideRef.current = null;
    }
    if (safetyRef.current) {
      clearTimeout(safetyRef.current);
      safetyRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimers();
    pendingRef.current = true;
    document.body.classList.add("is-navigating");
    setVisible(true);
    setProgress((current) => (current > 0 && current < 100 ? current : 14));

    tickRef.current = setInterval(() => {
      setProgress((current) => {
        if (current >= 92) return current;
        return Math.min(current + Math.random() * 10 + 3, 92);
      });
    }, 220);

    safetyRef.current = setTimeout(() => {
      if (!pendingRef.current) return;
      pendingRef.current = false;
      setProgress(100);
      hideRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
        document.body.classList.remove("is-navigating");
      }, 300);
    }, 12000);
  }, [clearTimers]);

  const complete = useCallback(() => {
    if (!pendingRef.current) return;
    pendingRef.current = false;
    clearTimers();
    setProgress(100);
    hideRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      document.body.classList.remove("is-navigating");
    }, 300);
  }, [clearTimers]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (isModifiedClick(event) || event.defaultPrevented) return;

      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor || !shouldHandleLink(anchor)) return;

      const href = anchor.getAttribute("href");
      if (!href || isSameDestination(href, pathname, search)) return;

      start();
    };

    const onNavigationStart = () => start();
    const onPopState = () => start();

    document.addEventListener("click", onClick, true);
    window.addEventListener(NAVIGATION_START_EVENT, onNavigationStart);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(NAVIGATION_START_EVENT, onNavigationStart);
      window.removeEventListener("popstate", onPopState);
      clearTimers();
      document.body.classList.remove("is-navigating");
    };
  }, [pathname, search, start, clearTimers]);

  useEffect(() => {
    complete();
  }, [pathname, search, complete]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="navigation-progress"
      role="progressbar"
      aria-hidden={!visible}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div className="navigation-progress__bar" style={{ width: `${progress}%` }} />
    </div>
  );
}
