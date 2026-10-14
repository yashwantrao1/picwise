import type { Metadata } from "next";
import { HomeLanding } from "@/components/landing/home-landing";
import { SiteFrame } from "@/components/landing/site-frame";
import { JsonLd } from "@/components/seo/json-ld";
import { homeJsonLd } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site-config";
import { shareImage } from "@/lib/site";

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
    siteName: siteConfig.name,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "PNG to WebP convertor in bulk · Picwise",
    description: "Batch convert images in the browser. Files never leave your device.",
    images: [shareImage],
  },
};

export default function HomePage() {
  return (
    <main id="main" className="flex w-full min-w-0 flex-1 flex-col">
      <JsonLd data={homeJsonLd()} />
      <SiteFrame />
      <HomeLanding />
    </main>
  );
}
