import type { Metadata } from "next";
import { Bebas_Neue, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import SkipLink from "@/components/SkipLink";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { PageTransitionProvider } from "@/components/PageTransition";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aswin Krishna | Toronto Photographer",
  description:
    "Story-driven photography portfolio based in Toronto, Ontario. Nature, travel, weddings, and casual moments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${cormorantGaramond.variable} ${inter.variable}`}
    >
      <body className="min-h-svh bg-[var(--bg)] text-[var(--fg)] font-sans antialiased selection:bg-[var(--accent)] selection:text-black">
        <SkipLink />
        <ScrollProgress />
        <CustomCursor />
        <PageTransitionProvider>
          <SmoothScroll>
            <div className="flex flex-col min-h-svh">
              <Nav />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </SmoothScroll>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
