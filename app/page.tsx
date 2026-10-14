import type { Metadata } from "next";
import { HomeLanding } from "@/components/landing/home-landing";
import { SiteFrame } from "@/components/landing/site-frame";
import { faqs, popularConversions, articlePath } from "@/lib/seo/conversions";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "PNG to WebP convertor in bulk · Picwise" },
  description:
    "Convert PNG, JPG, WebP, AVIF, GIF, BMP, TIFF, SVG, ICO, and HEIC in bulk. Private browser convertor — files never leave your device.",
  keywords: [
    "png to webp convertor in bulk",
    "jpg to webp convertor in bulk",
    "png to jpg convertor in bulk",
    "webp to png convertor in bulk",
    "webp to jpg convertor in bulk",
    "jpg to png convertor in bulk",
    "heic to jpg convertor in bulk",
    "avif to jpg convertor in bulk",
    "gif to png convertor in bulk",
    "bulk image convertor",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "PNG to WebP convertor in bulk · Picwise",
    description: "Batch convert images in the browser. Files never leave your device.",
    url: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Picwise",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      url: siteUrl,
      description: "Private in-browser bulk image convertor for PNG, JPG, WebP, AVIF, GIF, BMP, TIFF, SVG, ICO, and HEIC.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "ItemList",
      name: "Bulk image conversions",
      itemListElement: popularConversions.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: `${siteUrl}${articlePath(item.from, item.to)}`,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <main id="main" className="flex w-full min-w-0 flex-1 flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteFrame />
      <HomeLanding />
    </main>
  );
}
