import type { Metadata } from "next";
import Link from "next/link";
import { SiteFrame } from "@/components/landing/site-frame";
import { JsonLd } from "@/components/seo/json-ld";
import { privacySections, privacyUpdatedLabel, type InlinePart } from "@/lib/seo/privacy-content";
import { privacyJsonLd } from "@/lib/seo/schema";
import { shareImage } from "@/lib/site";

const title = "Privacy Policy · Picwise";
const description =
  "Picwise processes images in your browser. Photos are not uploaded. Google may use cookies to serve and measure ads. No account is required.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy policy",
    description,
    url: "/privacy",
    type: "website",
    siteName: "Picwise",
    locale: "en_US",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Picwise privacy policy",
    description,
    images: [shareImage],
  },
};

function RichText({ parts }: { parts: readonly InlinePart[] }) {
  return (
    <p className="mt-3">
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <a
            key={index}
            href={part.href}
            className="underline underline-offset-4"
            {...(part.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {part.label}
          </a>
        ),
      )}
    </p>
  );
}

export default function PrivacyPage() {
  const sections = privacySections();

  return (
    <main id="main" className="flex flex-1 flex-col">
      <JsonLd data={privacyJsonLd()} />
      <SiteFrame />
      <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <nav aria-label="Breadcrumb" className="text-muted-foreground font-mono text-xs">
          <ol className="flex gap-2">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">Privacy policy</li>
          </ol>
        </nav>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">Privacy policy</h1>
        <p className="text-muted-foreground mt-3 text-sm">{privacyUpdatedLabel}</p>
        <div className="mt-8 space-y-8 leading-7">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
              {section.blocks.map((block, index) =>
                block.kind === "list" ? (
                  <ul key={index} className="mt-3 list-disc space-y-2 pl-5">
                    {(block.items ?? []).map((item) => (
                      <li key={item.href}>
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <RichText key={index} parts={block.parts ?? []} />
                ),
              )}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
