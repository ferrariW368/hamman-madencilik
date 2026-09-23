import type { Metadata } from "next";
import { LegacyChrome } from "@/components/LegacyChrome";
import { inter, playfair } from "../fonts";
import "../globals.css";

export const metadata: Metadata = { title: "HAMMARBLE" };

export default function LegacyRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" dir="ltr" className={`${inter.variable} ${playfair.variable}`}><body className="font-[family-name:var(--font-body)]"><LegacyChrome>{children}</LegacyChrome></body></html>;
}
