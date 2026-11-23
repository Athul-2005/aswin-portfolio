import type { Metadata } from "next";
import { Bebas_Neue, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

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
  description: "Story-driven photography portfolio based in Toronto, Ontario. Nature, travel, weddings, and casual moments.",
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
        {children}
      </body>
    </html>
  );
}
