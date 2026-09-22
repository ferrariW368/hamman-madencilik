"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

export function LegacyChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isV2Route = /^\/(tr|en)(?:\/|$)/.test(pathname);

  if (isV2Route) return children;

  return <><Nav />{children}<Footer /></>;
}
