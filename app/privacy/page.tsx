import type { Metadata } from "next";
import Link from "next/link";
import { SiteFrame } from "@/components/landing/site-frame";
import { siteConfig } from "@/lib/site-config";
import { siteUrl } from "@/lib/site";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Picwise privacy policy",
    description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/privacy#webpage`,
      url: `${siteUrl}/privacy`,
      name: title,
      description,
      inLanguage: "en",
      dateModified: "2026-10-14",
      isPartOf: { "@type": "WebSite", name: "Picwise", url: siteUrl },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Privacy policy", item: `${siteUrl}/privacy` },
      ],
    },
  ],
};

export default function PrivacyPage() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
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
        <p className="text-muted-foreground mt-3 text-sm">Last updated 14 October 2026</p>
        <div className="mt-8 space-y-8 leading-7">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">What {siteConfig.name} is</h2>
            <p className="mt-3">
              {siteConfig.name} is a browser tool for converting and compressing images. There is no account. You do not sign in, and the site does not ask for your name, email address, or payment details.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Your images are not uploaded</h2>
            <p className="mt-3">
              When you drop a folder, pick files, or paste a picture, that data stays in the browser tab. Decoding, resizing, and encoding run on your device. The resulting files are downloaded back to your device. Closing the tab discards the batch. {siteConfig.name} does not receive a copy of your photos, and it does not build a library of them.
            </p>
            <p className="mt-3">
              A file the browser cannot decode fails on that card. It is not sent elsewhere to be retried.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">What is stored on your device</h2>
            <p className="mt-3">
              Conversion settings are saved in local storage in your browser so the next visit remembers them. That includes the output format, quality, resize width, background color, and the filename prefix and suffix. The theme you pick is stored the same way. These values stay on the device. They are not a profile on a server.
            </p>
            <p className="mt-3">Clearing site data for this origin removes those settings. The images themselves are not written into that storage.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">The app shell cache</h2>
            <p className="mt-3">
              A service worker may cache the pages and scripts that make {siteConfig.name} load, so the interface can open again without fetching every file. That cache is the application, not your pictures. Image bytes from a conversion are not put in the service worker cache.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Google advertising</h2>
            <p className="mt-3">
              This site shows ads from Google. Google and companies that help deliver those ads may set or read cookies and similar identifiers in your browser. They use them to show ads, count views and clicks, avoid repeating the same ad, and — where the law and your settings allow — to choose ads based on this site and other sites you have visited.
            </p>
            <p className="mt-3">
              That data is about the page visit. It is not the pictures you convert. Image files are not sent to Google as part of a conversion.
            </p>
            <p className="mt-3">Google describes this in its own pages:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  How Google uses information from sites or apps that use its services
                </a>
              </li>
              <li>
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  Google privacy policy
                </a>
              </li>
              <li>
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  How Google uses cookies in advertising
                </a>
              </li>
            </ul>
            <p className="mt-3">
              You can turn off personalized ads in{" "}
              <a href="https://myadcenter.google.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                Google Ad Center
              </a>
              . You can also opt out of some third-party advertising cookies at{" "}
              <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                optout.aboutads.info
              </a>{" "}
              and, in Europe, at{" "}
              <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                Your Online Choices
              </a>
              . Blocking cookies in the browser limits this too. The convertor still runs if you do.
            </p>
            <p className="mt-3">
              In the European Economic Area, the United Kingdom, and Switzerland, Google requires a choice before it uses data for personalized ads. Where that choice is shown, declining it means any ads are not personalized.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">What is not sold</h2>
            <p className="mt-3">
              {siteConfig.name} does not sell your photos and does not keep a customer list to sell. There is no account. A separate analytics product is not used to record which images you convert. The Google ad tag can still count that an ad was shown or clicked. Your browser, extensions, employer network, or the host that serves the website can still see ordinary request logs for the HTML and scripts. Those logs are not the contents of your images.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Children</h2>
            <p className="mt-3">{siteConfig.name} is not directed at children, and it does not collect an account that would identify one.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Changes</h2>
            <p className="mt-3">
              If this policy changes, the date at the top of the page changes with it. The rule that images are converted on the device is the point of the product. A change that started uploading photos would be a different product, and this page would say so.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
            <p className="mt-3">
              Questions about this policy can be sent to{" "}
              <a href={siteConfig.links.email} className="underline underline-offset-4">
                {siteConfig.links.email.replace("mailto:", "")}
              </a>{" "}
              or through{" "}
              <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {siteConfig.author} on GitHub
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
