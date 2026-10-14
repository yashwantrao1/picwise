import {
  articlePath,
  batchNote,
  conversionPath,
  faqs,
  formatFacts,
  formatIndexIntro,
  guides,
  homeHeadline,
  homeHeadlineRest,
  homeLede,
  popularConversions,
  sourceNotes,
  steps,
} from "@/lib/seo/conversions";
import { privacySectionText, privacySections, privacyUpdated, privacyUpdatedLabel } from "@/lib/seo/privacy-content";
import { getSeoPage, type SeoPage } from "@/lib/seo/pages";
import { siteConfig } from "@/lib/site-config";
import { siteUrl } from "@/lib/site";
import { FORMAT_LABEL } from "@/lib/utils/formats";
import { INPUT_FORMATS, OUTPUT_FORMATS } from "@/types";

export type SchemaValue = string | number | boolean | SchemaNode | readonly SchemaValue[];

export interface SchemaNode {
  readonly "@type"?: string | readonly string[];
  readonly "@id"?: string;
  readonly [key: string]: SchemaValue | undefined;
}

export interface JsonLdDocument {
  "@context": "https://schema.org";
  "@graph": readonly SchemaNode[];
}

const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;
const applicationId = `${siteUrl}/#application`;
const authorId = `${siteUrl}/#author`;
const logoId = `${siteUrl}/#logo`;

const featureList = [
  "Bulk folder conversion",
  "PNG, JPG, WebP, AVIF, GIF, BMP, TIFF, SVG, ICO, and HEIC input",
  "PNG, JPG, WebP, AVIF, GIF, BMP, and ICO output",
  "Quality, width, percentage, and target-size controls",
  "EXIF orientation, then metadata removal",
  "ZIP download",
  "Processing stays in the browser",
] as const;

function absolute(path: string): string {
  return path.startsWith("http") ? path : `${siteUrl}${path}`;
}

function document(nodes: readonly SchemaNode[]): JsonLdDocument {
  return { "@context": "https://schema.org", "@graph": nodes };
}

function listItems(items: readonly { name: string; url?: string; description?: string }[]): SchemaNode[] {
  return items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    ...(item.url ? { url: item.url, item: item.url } : {}),
    ...(item.description ? { description: item.description } : {}),
  }));
}

function siteNodes(): SchemaNode[] {
  const email = siteConfig.links.email.replace("mailto:", "");
  return [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.name,
      url: siteUrl,
      description: siteConfig.description,
      logo: { "@id": logoId },
      email,
      founder: { "@id": authorId },
      sameAs: [siteConfig.links.github, siteConfig.links.linkedin, siteConfig.links.portfolio, siteConfig.links.instagram],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email,
        url: `${siteUrl}/privacy#contact`,
        availableLanguage: "English",
      },
    },
    {
      "@type": "Person",
      "@id": authorId,
      name: siteConfig.author,
      url: siteConfig.links.portfolio,
      email,
      sameAs: [siteConfig.links.github, siteConfig.links.linkedin, siteConfig.links.instagram],
    },
    {
      "@type": "ImageObject",
      "@id": logoId,
      url: `${siteUrl}/picwise-brand-kit/picwise-logo-icon.svg`,
      contentUrl: `${siteUrl}/picwise-brand-kit/picwise-logo-icon.svg`,
      caption: `${siteConfig.name} logo`,
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: siteConfig.name,
      url: siteUrl,
      description: siteConfig.description,
      inLanguage: "en",
      publisher: { "@id": organizationId },
      copyrightHolder: { "@id": organizationId },
      publishingPrinciples: `${siteUrl}/privacy`,
      image: { "@id": logoId },
    },
    {
      "@type": ["WebApplication", "SoftwareApplication"],
      "@id": applicationId,
      name: siteConfig.name,
      url: `${siteUrl}/convertor`,
      applicationCategory: "MultimediaApplication",
      applicationSuite: siteConfig.name,
      operatingSystem: "Web browser",
      browserRequirements: "Requires a current browser with Web Workers and WebAssembly.",
      description:
        "Private in-browser bulk image convertor and compressor for PNG, JPG, WebP, AVIF, GIF, BMP, TIFF, SVG, ICO, and HEIC. Files never leave the device.",
      featureList: [...featureList],
      inLanguage: "en",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      publisher: { "@id": organizationId },
      author: { "@id": authorId },
      image: `${siteUrl}/opengraph-image`,
      sameAs: [siteConfig.links.github],
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#navigation`,
      name: "Site navigation",
      itemListElement: listItems([
        { name: "Home", url: siteUrl },
        { name: "Compress", url: `${siteUrl}/convertor` },
        { name: "Convert", url: `${siteUrl}/convertor` },
        { name: "Privacy policy", url: `${siteUrl}/privacy` },
      ]),
    },
  ];
}

function breadcrumbs(items: readonly { name: string; url: string }[]): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function faqNode(id: string, questions: readonly { question: string; answer: string }[]): SchemaNode {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: questions.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

function howToNode(id: string, name: string, description: string, stepUrl: (index: number) => string, howToSteps: readonly { name: string; text: string }[]): SchemaNode {
  return {
    "@type": "HowTo",
    "@id": id,
    name,
    description,
    inLanguage: "en",
    tool: { "@type": "HowToTool", name: siteConfig.name },
    supply: { "@type": "HowToSupply", name: "A folder of images" },
    step: howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: stepUrl(index),
    })),
  };
}

export function homeJsonLd(): JsonLdDocument {
  const pageId = `${siteUrl}/#webpage`;
  const pageName = `${homeHeadline} ${homeHeadlineRest}`;

  const guidesAsArticles: SchemaNode[] = guides.map((guide) => ({
    "@type": "Article",
    "@id": `${siteUrl}/#${guide.id}`,
    headline: guide.title,
    articleBody: guide.paragraphs.join("\n\n"),
    url: `${siteUrl}/#${guide.id}`,
    inLanguage: "en",
    author: { "@id": authorId },
    publisher: { "@id": organizationId },
    mainEntityOfPage: { "@id": pageId },
    about: { "@id": applicationId },
  }));

  return document([
    ...siteNodes(),
    {
      "@type": "CollectionPage",
      "@id": pageId,
      url: siteUrl,
      name: pageName,
      alternateName: "PNG to WebP convertor in bulk",
      description: homeLede,
      inLanguage: "en",
      isPartOf: { "@id": websiteId },
      about: { "@id": applicationId },
      publisher: { "@id": organizationId },
      author: { "@id": authorId },
      primaryImageOfPage: { "@type": "ImageObject", url: `${siteUrl}/opengraph-image` },
      hasPart: guides.map((guide) => ({ "@type": "Article", "@id": `${siteUrl}/#${guide.id}` })),
      potentialAction: {
        "@type": "ViewAction",
        name: "Open the convertor",
        target: `${siteUrl}/convertor`,
      },
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#popular`,
      name: "Bulk image conversions",
      itemListElement: listItems(
        popularConversions.map((item) => ({
          name: item.title,
          url: absolute(articlePath(item.from, item.to)),
        })),
      ),
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#formats`,
      name: "Every format to every format",
      description: formatIndexIntro,
      itemListElement: INPUT_FORMATS.map((source, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: FORMAT_LABEL[source],
        item: {
          "@type": "ItemList",
          name: FORMAT_LABEL[source],
          description: sourceNotes[source],
          url: `${siteUrl}/#from-${source}`,
          itemListElement: OUTPUT_FORMATS.map((target, targetIndex) => ({
            "@type": "ListItem",
            position: targetIndex + 1,
            name: source === target ? `Compress ${FORMAT_LABEL[source]} in bulk` : `${FORMAT_LABEL[source]} to ${FORMAT_LABEL[target]} convertor in bulk`,
            url: absolute(conversionPath(source, target)),
          })),
        },
      })),
    },
    {
      "@type": "DefinedTermSet",
      "@id": `${siteUrl}/#format-facts`,
      name: "Which format to pick",
      hasDefinedTerm: formatFacts.map((fact) => ({
        "@type": "DefinedTerm",
        name: fact.format,
        description: `Transparency: ${fact.alpha}. ${fact.note}`,
      })),
    },
    howToNode(
      `${siteUrl}/#howto`,
      "What happens to a batch",
      batchNote,
      (index) => `${siteUrl}/#batch-step-${index + 1}`,
      steps.map((step) => ({ name: step.title, text: step.body })),
    ),
    faqNode(
      `${siteUrl}/#faq`,
      faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
    ),
    ...guidesAsArticles,
  ]);
}

export function conversionJsonLd(page: SeoPage): JsonLdDocument {
  const url = `${siteUrl}/${page.slug}`;
  const pageId = `${url}#webpage`;
  const articleBody = [page.lede, ...page.sections.flatMap((section) => section.paragraphs)].join("\n\n");
  const related = page.related.map((slug) => getSeoPage(slug)).filter((item): item is SeoPage => item !== undefined);

  return document([
    ...siteNodes(),
    {
      "@type": "WebPage",
      "@id": pageId,
      url,
      name: page.h1,
      description: page.description,
      inLanguage: "en",
      isPartOf: { "@id": websiteId },
      about: { "@id": applicationId },
      publisher: { "@id": organizationId },
      primaryImageOfPage: { "@type": "ImageObject", url: `${siteUrl}/opengraph-image` },
      mainEntity: { "@id": `${url}#article` },
      significantLink: absolute(conversionPath(page.from, page.to)),
      potentialAction: {
        "@type": "ViewAction",
        name: `Open the ${FORMAT_LABEL[page.from]} to ${FORMAT_LABEL[page.to]} convertor`,
        target: absolute(conversionPath(page.from, page.to)),
      },
    },
    breadcrumbs([
      { name: "Home", url: siteUrl },
      { name: page.h1, url },
    ]),
    {
      "@type": "TechArticle",
      "@id": `${url}#article`,
      headline: page.h1,
      name: page.title,
      description: page.lede,
      articleBody,
      articleSection: page.sections.map((section) => section.heading),
      keywords: page.keywords.join(", "),
      inLanguage: "en",
      url,
      isAccessibleForFree: true,
      author: { "@id": authorId },
      publisher: { "@id": organizationId },
      mainEntityOfPage: { "@id": pageId },
      about: [
        { "@type": "DefinedTerm", name: FORMAT_LABEL[page.from], description: sourceNotes[page.from] },
        { "@type": "DefinedTerm", name: FORMAT_LABEL[page.to] },
      ],
      hasPart: page.sections.map((section, index) => ({
        "@type": "WebPageElement",
        name: section.heading,
        text: section.paragraphs.join("\n\n"),
        position: index + 1,
      })),
    },
    howToNode(
      `${url}#howto`,
      `How to convert ${FORMAT_LABEL[page.from]} to ${FORMAT_LABEL[page.to]}`,
      page.description,
      (index) => `${url}#step-${index + 1}`,
      page.steps,
    ),
    faqNode(`${url}#faq`, page.faqs),
    {
      "@type": "ItemList",
      name: "Related convertors",
      itemListElement: listItems([
        ...related.map((item) => ({ name: item.h1, url: `${siteUrl}/${item.slug}` })),
        { name: "Privacy policy", url: `${siteUrl}/privacy` },
      ]),
    },
  ]);
}

export interface ConvertorSchemaInput {
  headline: string;
  steps: readonly { name: string; text: string }[];
  sections: readonly { name: string; text: string }[];
  inputs: readonly string[];
  outputs: readonly string[];
}

export function convertorJsonLd(input: ConvertorSchemaInput): JsonLdDocument {
  const url = `${siteUrl}/convertor`;
  return document([
    ...siteNodes(),
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: input.headline,
      description: "Your files never leave your device. Conversion, compression, and ZIP creation all happen locally in this browser.",
      inLanguage: "en",
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": applicationId },
      publisher: { "@id": organizationId },
      primaryImageOfPage: { "@type": "ImageObject", url: `${siteUrl}/opengraph-image` },
      hasPart: input.sections.map((section, index) => ({
        "@type": "WebPageElement",
        name: section.name,
        text: section.text,
        position: index + 1,
      })),
    },
    howToNode(
      `${url}#howto`,
      "Four moves, then the zip.",
      "The convertor is the panel above. This is the same job, written out so the buttons mean something the first time.",
      (index) => `${url}#guide-step-${index + 1}`,
      input.steps,
    ),
    {
      "@type": "ItemList",
      name: "Input formats",
      itemListElement: listItems(input.inputs.map((name) => ({ name }))),
    },
    {
      "@type": "ItemList",
      name: "Output formats",
      itemListElement: listItems(input.outputs.map((name) => ({ name }))),
    },
  ]);
}

export function privacyJsonLd(): JsonLdDocument {
  const url = `${siteUrl}/privacy`;
  const sections = privacySections();
  const articleBody = [privacyUpdatedLabel, ...sections.map((section) => `${section.heading}\n\n${privacySectionText(section)}`)].join("\n\n");

  return document([
    ...siteNodes(),
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: "Privacy policy",
      description:
        "Picwise processes images in your browser. Photos are not uploaded. Google may use cookies to serve and measure ads. No account is required.",
      inLanguage: "en",
      dateModified: privacyUpdated,
      isPartOf: { "@id": websiteId },
      about: { "@id": applicationId },
      publisher: { "@id": organizationId },
      mainEntity: { "@id": `${url}#article` },
      primaryImageOfPage: { "@type": "ImageObject", url: `${siteUrl}/opengraph-image` },
    },
    breadcrumbs([
      { name: "Home", url: siteUrl },
      { name: "Privacy policy", url },
    ]),
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: "Privacy policy",
      description: privacyUpdatedLabel,
      dateModified: privacyUpdated,
      articleBody,
      inLanguage: "en",
      url,
      author: { "@id": authorId },
      publisher: { "@id": organizationId },
      mainEntityOfPage: { "@id": `${url}#webpage` },
      hasPart: sections.map((section) => ({
        "@type": "WebPageElement",
        "@id": `${url}#${section.id}`,
        name: section.heading,
        text: privacySectionText(section),
        url: `${url}#${section.id}`,
      })),
    },
  ]);
}
