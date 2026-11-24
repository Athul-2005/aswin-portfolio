import type { Metadata } from "next";
import { Bebas_Neue, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import Shell from "@/components/Shell";

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
  metadataBase: new URL("https://aswinkrishna.photography"),
  title: {
    default: "Aswin Krishna | Toronto Photographer",
    template: "%s | Aswin Krishna Photography Toronto",
  },
  description:
    "Story-driven portfolio of Aswin Krishna, a Toronto photographer specializing in nature and travel, intimate weddings, and casual everyday memories.",
  keywords: [
    "Toronto photographer",
    "Ontario wedding photographer",
    "nature photography Toronto",
    "travel photographer Ontario",
    "Toronto photo sessions",
    "cinematic photography",
  ],
  authors: [{ name: "Aswin Krishna" }],
  creator: "Aswin Krishna",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://aswinkrishna.photography",
    siteName: "Aswin Krishna Photography",
    title: "Aswin Krishna | Toronto Photographer",
    description:
      "Story-driven portfolio of Aswin Krishna, a Toronto photographer specializing in nature, weddings, and casual moments.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aswin Krishna | Toronto Photographer",
    description:
      "Story-driven photography portfolio based in Toronto, Ontario, Canada.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
