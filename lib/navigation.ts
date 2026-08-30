export const NAVIGATION_START_EVENT = "app:navigation-start";

export function notifyNavigationStart() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NAVIGATION_START_EVENT));
  }
}
