"use client";

import { useEffect, useState } from "react";

export function useIsDesktopHover(): boolean {
  const [isDesktopHover, setIsDesktopHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsDesktopHover(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isDesktopHover;
}
