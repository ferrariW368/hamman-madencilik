import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { LegacyChrome } from "@/components/LegacyChrome";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = { title: "HAMMARBLE" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-[family-name:var(--font-body)]"><LegacyChrome>{children}</LegacyChrome></body>
    </html>
  );
}
