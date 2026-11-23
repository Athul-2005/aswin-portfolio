"use client";

import { useRef } from "react";
import { motion, useSpring, useReducedMotion } from "motion/react";
import TransitionLink from "./TransitionLink";
import { useIsDesktopHover } from "@/hooks/useIsDesktopHover";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function MagneticButton({
  href,
  children,
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktopHover();
  const shouldReduceMotion = useReducedMotion();

  const springConfig = { damping: 15, stiffness: 150, mass: 0.2 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !isDesktop || shouldReduceMotion) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    // Moves up to ~12px toward pointer within 80px radius
    const maxRadius = 80;
    if (distance < maxRadius) {
      const power = (maxRadius - distance) / maxRadius;
      const moveX = (distanceX / distance) * 12 * power;
      const moveY = (distanceY / distance) * 12 * power;
      springX.set(moveX);
      springY.set(moveY);
    } else {
      springX.set(0);
      springY.set(0);
    }
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block p-4"
    >
      <motion.div
        style={{
          x: shouldReduceMotion ? 0 : springX,
          y: shouldReduceMotion ? 0 : springY,
        }}
      >
        <TransitionLink
          href={href}
          className={`inline-block px-8 py-4 border border-[var(--fg)] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium text-[var(--fg)] bg-transparent hover:bg-[var(--fg)] hover:text-black transition-colors duration-300 focus-visible:outline-1 focus-visible:outline-[var(--accent)] ${className}`}
        >
          {children}
        </TransitionLink>
      </motion.div>
    </div>
  );
}
