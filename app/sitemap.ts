import type { MetadataRoute } from "next";
import { seoPages } from "@/lib/seo/pages";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/convertor`, changeFrequency: "monthly", priority: 0.9 },
    ...seoPages.map((page) => ({
      url: `${siteUrl}/${page.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
