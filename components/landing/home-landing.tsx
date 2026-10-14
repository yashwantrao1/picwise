"use client";

import { ConversionIndex } from "@/components/landing/conversion-index";
import { Guides } from "@/components/landing/guides";
import { Masthead } from "@/components/landing/masthead";
import { MotionProvider } from "@/components/landing/motion-provider";

export function HomeLanding() {
  return (
    <MotionProvider>
      <Masthead />
      <ConversionIndex />
      <Guides />
    </MotionProvider>
  );
}
