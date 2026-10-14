import Link from "next/link";
import { SiteFrame } from "@/components/landing/site-frame";
import { conversionJsonLd, converterHref, getSeoPage, type SeoPage } from "@/lib/seo/pages";
import { siteUrl } from "@/lib/site";
import { FORMAT_LABEL } from "@/lib/utils/formats";

export function ConversionArticle({ page }: { page: SeoPage }) {
  const related = page.related.map((slug) => getSeoPage(slug)).filter((item): item is SeoPage => item !== undefined);
  const jsonLd = conversionJsonLd(page, siteUrl);

  return (
    <main id="main" className="flex flex-1 flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteFrame />
      <article className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <nav aria-label="Breadcrumb" className="text-muted-foreground font-mono text-xs">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{page.h1}</li>
          </ol>
        </nav>
        <header className="mt-6 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="text-primary font-mono text-xs tracking-[0.16em] uppercase">
              {FORMAT_LABEL[page.from]} to {FORMAT_LABEL[page.to]}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{page.h1}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8">{page.lede}</p>
          </div>
          <div className="lg:col-span-4 lg:pt-8">
            <Link
              href={converterHref(page)}
              className="bg-primary text-primary-foreground focus-visible:outline-ring inline-flex min-h-11 items-center px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Open the {FORMAT_LABEL[page.from]} to {FORMAT_LABEL[page.to]} convertor
            </Link>
            <p className="text-muted-foreground mt-3 text-sm leading-6">Output is already {FORMAT_LABEL[page.to]}. Add a folder and download a zip.</p>
          </div>
        </header>

        <div className="mt-12 space-y-10">
          {page.sections.map((section) => (
            <section key={section.heading} className="border-t pt-8">
              <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
              <div className="mt-4 max-w-3xl space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="leading-7">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 border-t pt-8" aria-labelledby="howto-heading">
          <h2 id="howto-heading" className="text-2xl font-semibold tracking-tight">
            How to convert {FORMAT_LABEL[page.from]} to {FORMAT_LABEL[page.to]}
          </h2>
          <ol className="mt-6 max-w-3xl space-y-5 border-l pl-6">
            {page.steps.map((step, index) => (
              <li key={step.name} id={`step-${index + 1}`}>
                <p className="text-muted-foreground font-mono text-xs">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-semibold">{step.name}</h3>
                <p className="text-muted-foreground mt-1 leading-6">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 border-t pt-8" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
            {page.h1} questions
          </h2>
          <dl className="mt-6 max-w-3xl space-y-6">
            {page.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-semibold">{faq.question}</dt>
                <dd className="text-muted-foreground mt-2 leading-7">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 border-t pt-8" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-semibold tracking-tight">
            Related convertors
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/${item.slug}`} className="border-foreground/25 hover:bg-foreground hover:text-background inline-flex min-h-10 items-center border px-3 text-sm">
                  {item.h1}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="border-foreground/25 hover:bg-foreground hover:text-background inline-flex min-h-10 items-center border px-3 text-sm">
                Privacy policy
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}
