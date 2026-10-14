"use client";

import Link from "next/link";
import { useState } from "react";
import { Flap } from "@/components/landing/flap";
import { conversionPath, formatIndexIntro, sourceNotes } from "@/lib/seo/conversions";
import { FORMAT_LABEL } from "@/lib/utils/formats";
import { INPUT_FORMATS, OUTPUT_FORMATS, type InputFormat, type OutputFormat } from "@/types";

export function ConversionIndex() {
  const [pick, setPick] = useState<{ from: InputFormat; to: OutputFormat } | null>(null);
  const fromLabel = pick ? FORMAT_LABEL[pick.from] : "PNG";
  const toLabel = pick ? FORMAT_LABEL[pick.to] : "WebP";

  return (
    <section id="formats" className="mx-auto w-full min-w-0 max-w-6xl px-4 py-6 sm:px-6" aria-labelledby="all-formats">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-4">
        <div>
          <h2 id="all-formats" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Every format to every format
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">{formatIndexIntro}</p>
        </div>
        <p className="flex items-baseline gap-2 font-mono text-xl">
          <Flap text={fromLabel} />
          <span aria-hidden className="text-primary">
            →
          </span>
          <Flap text={toLabel} />
        </p>
      </div>
      <div className="mt-8 columns-1 gap-x-12 sm:columns-2">
        {INPUT_FORMATS.map((source) => (
          <section key={source} id={`from-${source}`} className="mb-10 scroll-mt-28 break-inside-avoid">
            <h3 className="font-mono text-sm tracking-wide">{FORMAT_LABEL[source]}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-6">{sourceNotes[source]}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {OUTPUT_FORMATS.map((target) => {
                const label = `${FORMAT_LABEL[source]} to ${FORMAT_LABEL[target]}`;
                return (
                  <li key={target}>
                    <Link
                      href={conversionPath(source, target)}
                      aria-label={source === target ? `Compress ${FORMAT_LABEL[source]} in bulk` : `${label} convertor in bulk`}
                      className="focus-visible:outline-ring border-foreground/25 hover:bg-foreground hover:text-background inline-flex min-h-10 items-center border px-2.5 py-1.5 font-mono text-xs tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      onMouseEnter={() => setPick({ from: source, to: target })}
                      onFocus={() => setPick({ from: source, to: target })}
                    >
                      {FORMAT_LABEL[source]} → {FORMAT_LABEL[target]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
