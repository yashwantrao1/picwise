import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ConversionArticle } from "@/components/seo/conversion-article";
import { conversionMetadata, getSeoPage, seoPages } from "@/lib/seo/pages";

export function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};
  return conversionMetadata(page);
}

function ConversionFallback() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl animate-pulse px-4 py-10 sm:px-6 lg:py-14">
        <div className="bg-muted h-4 w-28" />
        <div className="bg-muted mt-6 h-12 w-full max-w-xl" />
        <div className="bg-muted mt-5 h-24 max-w-2xl" />
      </div>
    </main>
  );
}

async function ConversionBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();
  return <ConversionArticle page={page} />;
}

export default function ConversionPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<ConversionFallback />}>
      <ConversionBody params={params} />
    </Suspense>
  );
}
