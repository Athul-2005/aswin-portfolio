"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import { PageTransitionProvider } from "@/components/PageTransition";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin is private and plain: does not load public Nav, Footer, ScrollProgress, SkipLink, SmoothScroll or PageTransition
    return <>{children}</>;
  }

  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <PageTransitionProvider>
        <SmoothScroll>
          <div className="flex flex-col min-h-svh">
            <Nav />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </SmoothScroll>
      </PageTransitionProvider>
    </>
  );
}
