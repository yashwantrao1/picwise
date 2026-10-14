import { siteConfig } from "@/lib/site-config";

export type InlinePart = string | { href: string; label: string; external?: boolean };

export interface PrivacyBlock {
  kind: "paragraph" | "list";
  parts?: readonly InlinePart[];
  items?: readonly { href: string; label: string }[];
}

export interface PrivacySection {
  id: string;
  heading: string;
  blocks: readonly PrivacyBlock[];
}

export const privacyUpdated = "2026-10-14";
export const privacyUpdatedLabel = "Last updated 14 October 2026";

function textOf(parts: readonly InlinePart[]): string {
  return parts.map((part) => (typeof part === "string" ? part : part.label)).join("");
}

export function privacySectionText(section: PrivacySection): string {
  return section.blocks
    .map((block) => {
      if (block.kind === "list") return (block.items ?? []).map((item) => item.label).join("\n");
      return textOf(block.parts ?? []);
    })
    .join("\n\n");
}

export function privacySections(): readonly PrivacySection[] {
  const name = siteConfig.name;
  const email = siteConfig.links.email.replace("mailto:", "");

  return [
    {
      id: "what-this-is",
      heading: `What ${name} is`,
      blocks: [
        {
          kind: "paragraph",
          parts: [
            `${name} is a browser tool for converting and compressing images. There is no account. You do not sign in, and the site does not ask for your name, email address, or payment details.`,
          ],
        },
      ],
    },
    {
      id: "images",
      heading: "Your images are not uploaded",
      blocks: [
        {
          kind: "paragraph",
          parts: [
            `When you drop a folder, pick files, or paste a picture, that data stays in the browser tab. Decoding, resizing, and encoding run on your device. The resulting files are downloaded back to your device. Closing the tab discards the batch. ${name} does not receive a copy of your photos, and it does not build a library of them.`,
          ],
        },
        {
          kind: "paragraph",
          parts: ["A file the browser cannot decode fails on that card. It is not sent elsewhere to be retried."],
        },
      ],
    },
    {
      id: "device-storage",
      heading: "What is stored on your device",
      blocks: [
        {
          kind: "paragraph",
          parts: [
            "Conversion settings are saved in local storage in your browser so the next visit remembers them. That includes the output format, quality, resize width, background color, and the filename prefix and suffix. The theme you pick is stored the same way. These values stay on the device. They are not a profile on a server.",
          ],
        },
        {
          kind: "paragraph",
          parts: ["Clearing site data for this origin removes those settings. The images themselves are not written into that storage."],
        },
      ],
    },
    {
      id: "app-shell",
      heading: "The app shell cache",
      blocks: [
        {
          kind: "paragraph",
          parts: [
            `A service worker may cache the pages and scripts that make ${name} load, so the interface can open again without fetching every file. That cache is the application, not your pictures. Image bytes from a conversion are not put in the service worker cache.`,
          ],
        },
      ],
    },
    {
      id: "advertising",
      heading: "Google advertising",
      blocks: [
        {
          kind: "paragraph",
          parts: [
            "This site shows ads from Google. Google and companies that help deliver those ads may set or read cookies and similar identifiers in your browser. They use them to show ads, count views and clicks, avoid repeating the same ad, and — where the law and your settings allow — to choose ads based on this site and other sites you have visited.",
          ],
        },
        {
          kind: "paragraph",
          parts: [
            "That data is about the page visit. It is not the pictures you convert. Image files are not sent to Google as part of a conversion.",
          ],
        },
        {
          kind: "paragraph",
          parts: [
            "Google Analytics also runs on this site. It records the page you open, the browser, and a general location. It does not receive the pictures you convert.",
          ],
        },
        { kind: "paragraph", parts: ["Google describes this in its own pages:"] },
        {
          kind: "list",
          items: [
            {
              href: "https://policies.google.com/technologies/partner-sites",
              label: "How Google uses information from sites or apps that use its services",
            },
            { href: "https://policies.google.com/privacy", label: "Google privacy policy" },
            { href: "https://policies.google.com/technologies/ads", label: "How Google uses cookies in advertising" },
          ],
        },
        {
          kind: "paragraph",
          parts: [
            "You can turn off personalized ads in ",
            { href: "https://myadcenter.google.com", label: "Google Ad Center", external: true },
            ". You can also opt out of some third-party advertising cookies at ",
            { href: "https://optout.aboutads.info/", label: "optout.aboutads.info", external: true },
            " and, in Europe, at ",
            { href: "https://www.youronlinechoices.eu/", label: "Your Online Choices", external: true },
            ". Blocking cookies in the browser limits this too. The convertor still runs if you do.",
          ],
        },
        {
          kind: "paragraph",
          parts: [
            "In the European Economic Area, the United Kingdom, and Switzerland, Google requires a choice before it uses data for personalized ads. Where that choice is shown, declining it means any ads are not personalized.",
          ],
        },
      ],
    },
    {
      id: "not-sold",
      heading: "What is not sold",
      blocks: [
        {
          kind: "paragraph",
          parts: [
            `${name} does not sell your photos and does not keep a customer list to sell. There is no account. Google Analytics records page visits, not which images you convert. The Google ad tag can still count that an ad was shown or clicked. Your browser, extensions, employer network, or the host that serves the website can still see ordinary request logs for the HTML and scripts. Those logs are not the contents of your images.`,
          ],
        },
      ],
    },
    {
      id: "children",
      heading: "Children",
      blocks: [
        {
          kind: "paragraph",
          parts: [`${name} is not directed at children, and it does not collect an account that would identify one.`],
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes",
      blocks: [
        {
          kind: "paragraph",
          parts: [
            "If this policy changes, the date at the top of the page changes with it. The rule that images are converted on the device is the point of the product. A change that started uploading photos would be a different product, and this page would say so.",
          ],
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [
        {
          kind: "paragraph",
          parts: [
            "Questions about this policy can be sent to ",
            { href: siteConfig.links.email, label: email },
            " or through ",
            { href: siteConfig.links.github, label: `${siteConfig.author} on GitHub`, external: true },
            ".",
          ],
        },
      ],
    },
  ];
}
