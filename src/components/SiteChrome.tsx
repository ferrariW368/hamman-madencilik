"use client";

import { usePathname } from "next/navigation";

/**
 * Routes that must render without the site header and footer.
 *
 * `/tanitim` is not merely a stylistic choice. `IntroScene` derives scroll
 * progress from `container.scrollHeight - window.innerHeight` measured against
 * document-level `window.scrollY`, which is only correct while the scroll
 * container is the first and only element in the document flow. A header above
 * it offsets `window.scrollY` from the container's own top, so progress starts
 * above 0 and every stage boundary lands early — silently, with no error and no
 * crash. A footer below it lets the page keep scrolling after progress has
 * already saturated at 1, unpinning the sticky canvas and scrolling the scene
 * off screen. Keeping the route bare is what makes the stage timings correct.
 */
const CHROMELESS_ROUTES = ["/tanitim"];

/**
 * Hides the site chrome it wraps on the routes listed above.
 *
 * The chrome is passed in as `children` rather than imported here, so `Nav` and
 * `Footer` stay server components and add no JavaScript to any page; this
 * boundary exists only to read the pathname, which a server layout cannot do.
 * `usePathname` is available during server rendering too, so the chromeless
 * routes ship no header/footer markup at all rather than removing it after
 * hydration — no flash, and no hydration mismatch.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const chromeless = CHROMELESS_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (chromeless) return null;

  return <>{children}</>;
}
