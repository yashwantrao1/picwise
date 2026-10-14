import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase">404</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">This file isn&apos;t in the folder.</h1>
          <p className="text-muted-foreground mt-4 max-w-md text-lg leading-8">
            The address doesn&apos;t match a page. Nothing was uploaded, and nothing is waiting here. Drop the real folder on the convertor.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/convertor"
              className="bg-primary text-primary-foreground focus-visible:outline-ring inline-flex min-h-11 items-center px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Open the convertor
            </Link>
            <Link
              href="/"
              className="focus-visible:outline-ring inline-flex min-h-11 items-center border-b border-current pb-0.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Back to Picwise
            </Link>
          </div>
        </div>
        <div className="border border-black/20 bg-[#f4efe4] text-[#1c1915] shadow-[6px_6px_0_0_rgba(0,0,0,0.28)]" aria-hidden="true">
          <div className="flex items-baseline justify-between border-b border-current/15 px-4 py-2 font-mono text-[11px] tracking-[0.16em]">
            <span>JOB TICKET</span>
            <span>MISSING</span>
          </div>
          <dl>
            {[
              ["File", "unknown.???"],
              ["Status", "not in the batch"],
              ["Output", "none"],
              ["Next", "open the convertor"],
            ].map(([name, value]) => (
              <div key={name} className="flex items-baseline justify-between gap-8 border-b border-dashed border-current/15 px-4 py-3 font-mono text-sm last:border-b-0">
                <dt className="text-current/60">{name}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
