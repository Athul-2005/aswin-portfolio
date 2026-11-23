"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

interface TransitionContextType {
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigate: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(TransitionContext);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const navigate = (href: string) => {
    if (shouldReduceMotion) {
      router.push(href);
      return;
    }

    setIsTransitioning(true);
    // Panel wipes up over 0.5s, then push route
    setTimeout(() => {
      startTransition(() => {
        router.push(href);
      });
      // After navigation settles, wipe away
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 500);
  };

  return (
    <TransitionContext.Provider value={{ navigate, isTransitioning: isTransitioning || isPending }}>
      {children}
      <AnimatePresence>
        {isTransitioning && !shouldReduceMotion && (
          <motion.div
            key="page-wipe"
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ originY: 1 }}
            className="fixed inset-0 bg-[#000000] z-[9990] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
