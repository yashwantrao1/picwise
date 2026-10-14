"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/landing/motion-provider";

export function Flap({ text }: { text: string }) {
  const reduce = useReducedMotion() === true;
  return (
    <span className="relative inline-block h-[1.15em] min-w-[4.75rem] overflow-hidden align-bottom">
      <AnimatePresence initial={false} mode="popLayout">
        <m.span
          key={text}
          className="absolute top-0 left-0 block"
          initial={reduce ? false : { y: "110%" }}
          animate={{ y: "0%" }}
          exit={reduce ? undefined : { y: "-110%" }}
          transition={{ duration: reduce ? 0 : 0.38, ease: EASE }}
        >
          {text}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
