"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useIsDesktopHover } from "@/hooks/useIsDesktopHover";

export default function CustomCursor() {
  const isDesktop = useIsDesktopHover();
  const [cursorText, setCursorText] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) {
        setCursorText("");
        return;
      }

      // Check for interactive targets
      const galleryTarget = target.closest("[data-cursor='view']");
      const interactiveTarget = target.closest("a, button, [role='button'], input, textarea");

      if (galleryTarget) {
        setCursorText("View");
      } else if (interactiveTarget) {
        setCursorText("Open");
      } else {
        setCursorText("");
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isDesktop, isVisible, mouseX, mouseY]);

  if (!isDesktop || !isVisible) return null;

  const isEnlarged = cursorText.length > 0;
  const size = isEnlarged ? 72 : 10;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-['Inter',sans-serif] text-[10px] tracking-widest uppercase font-semibold text-black transition-colors"
      style={{
        x: cursorX,
        y: cursorY,
        width: size,
        height: size,
        backgroundColor: isEnlarged ? "var(--accent)" : "var(--fg)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {isEnlarged && cursorText}
    </motion.div>
  );
}
