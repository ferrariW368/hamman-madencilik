import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Hamman Madencilik",
  description: "Mermer ocak işletmeciliği ve doğal taş üretimi — Konya, Türkiye.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${playfair.variable} font-[family-name:var(--font-body)]`}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
