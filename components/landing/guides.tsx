"use client";

import { m, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { batchNote, conversionPath, faqs, formatFacts, guides, steps } from "@/lib/seo/conversions";
import { EASE } from "@/components/landing/motion-provider";

export function Guides() {
  const reduce = useReducedMotion() === true;

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-20 sm:px-6">
      <section className="border-t py-12" aria-labelledby="batch-heading">
        <h2 id="batch-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What happens to a batch
        </h2>
        <div className="relative mt-8">
          <m.span
            aria-hidden
            className="bg-foreground absolute top-0 left-0 w-px origin-top"
            style={{ height: "100%" }}
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
          />
          <ol className="space-y-8 border-l pl-6">
          {steps.map((step, index) => (
            <li key={step.title} id={`batch-step-${index + 1}`} className="relative">
              <p className="text-muted-foreground font-mono text-xs">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">{step.body}</p>
            </li>
          ))}
          </ol>
        </div>
        <p className="text-muted-foreground mt-8 max-w-2xl text-sm leading-6">{batchNote}</p>
      </section>

      <section className="border-t py-12" aria-labelledby="facts-heading">
        <h2 id="facts-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Which format to pick
        </h2>
        <ul className="mt-6 space-y-4 md:hidden">
          {formatFacts.map((fact) => (
            <li key={fact.format} className="border-b pb-4">
              <p className="font-mono text-xs font-medium">{fact.format}</p>
              <p className="mt-1 text-sm">Transparency: {fact.alpha}</p>
              <p className="text-muted-foreground mt-1 text-sm leading-6">{fact.note}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 hidden max-w-full overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Image formats Picwise can read or write</caption>
            <thead>
              <tr className="border-b font-mono text-xs tracking-wide">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Format
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Transparency
                </th>
                <th scope="col" className="py-2 font-medium">
                  What it is for
                </th>
              </tr>
            </thead>
            <tbody>
              {formatFacts.map((fact) => (
                <tr key={fact.format} className="border-b align-top">
                  <th scope="row" className="py-3 pr-4 font-mono text-xs font-medium">
                    {fact.format}
                  </th>
                  <td className="py-3 pr-4">{fact.alpha}</td>
                  <td className="text-muted-foreground py-3 leading-6">{fact.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {guides.map((guide) => (
        <article key={guide.id} id={guide.id} className="scroll-mt-28 border-t py-12">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="min-w-0 lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
              <h2 className="text-2xl font-semibold tracking-tight">{guide.title}</h2>
              <Link
                href={conversionPath(guide.from, guide.to)}
                className="focus-visible:outline-ring mt-4 inline-flex border-b border-current pb-0.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Open this convertor
              </Link>
            </div>
            <div className="min-w-0 space-y-4 lg:col-span-8">
              {guide.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-base leading-7 break-words">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      ))}

      <section className="border-t py-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Questions
        </h2>
        <dl className="mt-8 max-w-3xl space-y-8">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="text-lg font-semibold">{faq.question}</dt>
              <dd className="text-muted-foreground mt-2 leading-7">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
