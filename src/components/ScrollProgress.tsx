"use client";

import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 right-0 bottom-0 w-[1px] bg-[var(--line)] z-50 pointer-events-none"
    >
      <motion.div
        className="w-full bg-[var(--accent)] origin-top h-full"
        style={{ scaleY }}
      />
    </div>
  );
}
