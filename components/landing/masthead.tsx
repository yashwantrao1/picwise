"use client";

import { m, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Flap } from "@/components/landing/flap";
import { EASE } from "@/components/landing/motion-provider";
import { articlePath, homeHeadline, homeHeadlineRest, homeLede, popularConversions, type ConversionLink } from "@/lib/seo/conversions";
import { FORMAT_LABEL } from "@/lib/utils/formats";

export function Masthead() {
  const reduce = useReducedMotion() === true;
  const [flapIndex, setFlapIndex] = useState(0);
  const [hover, setHover] = useState<ConversionLink | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused || hover) return;
    const id = window.setInterval(() => {
      setFlapIndex((current) => (current + 1) % popularConversions.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduce, paused, hover]);

  const shown = hover ?? popularConversions[flapIndex] ?? popularConversions[0];

  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:py-16">
      <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
        <Link
          href={articlePath(shown.from, shown.to)}
          className="focus-visible:outline-ring block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">On the bench</p>
          <p className="mt-3 flex items-center gap-3 font-mono text-3xl tracking-tight sm:text-4xl">
            <Flap text={FORMAT_LABEL[shown.from]} />
            <span aria-hidden className="text-primary">
              →
            </span>
            <Flap text={FORMAT_LABEL[shown.to]} />
          </p>
          <p className="mt-4 max-w-sm text-lg leading-snug">{shown.title}</p>
        </Link>
        <h1 className="mt-10 text-[2.5rem] leading-[0.92] font-semibold tracking-tight sm:text-6xl">
          {homeHeadline}
          <span className="text-muted-foreground mt-1 block">{homeHeadlineRest}</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-7">{homeLede}</p>
        <m.span className="mt-8 inline-flex" initial="rest" whileHover="hot" animate="rest">
          <Link
            href="/convertor"
            className="focus-visible:outline-ring inline-flex items-center gap-3 border-b border-current pb-1 text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Open the convertor
            <m.span aria-hidden variants={{ rest: { x: 0 }, hot: { x: reduce ? 0 : 6 } }} transition={{ duration: 0.25, ease: EASE }}>
              →
            </m.span>
          </Link>
        </m.span>
      </div>
      <nav aria-label="Popular bulk conversions" className="lg:col-span-7" onMouseLeave={() => setHover(null)}>
        <ol className="border-t">
          {popularConversions.map((item, index) => {
            const active = hover?.from === item.from && hover.to === item.to;
            return (
              <li key={item.title}>
                <m.div initial="rest" whileHover="hot" animate="rest">
                  <Link
                    href={articlePath(item.from, item.to)}
                    className="focus-visible:outline-ring relative flex items-baseline gap-4 border-b px-2 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    onMouseEnter={() => setHover(item)}
                    onFocus={() => setHover(item)}
                    aria-current={active ? "true" : undefined}
                  >
                    {active ? (
                      <m.span
                        layoutId="conversion-row"
                        className="bg-accent absolute inset-0"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38, mass: 0.7 }}
                      />
                    ) : null}
                    <span className="text-muted-foreground relative w-8 font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>
                    <span className="relative flex-1 text-sm leading-6 sm:text-base">{item.title}</span>
                    <m.span
                      aria-hidden
                      className="relative font-mono text-sm"
                      variants={{ rest: { x: 0 }, hot: { x: reduce ? 0 : 6 } }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      →
                    </m.span>
                  </Link>
                </m.div>
              </li>
            );
          })}
        </ol>
      </nav>
    </section>
  );
}
