import Link from "next/link";
import { Globe, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { io } from "next/cache";
import { Suspense, type ComponentType, type SVGProps } from "react";
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee-button";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/social-icons";
import { Wordmark } from "@/components/wordmark";
import { siteConfig } from "@/lib/site-config";

type LinkIcon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

const connectLinks: readonly { href: string; label: string; icon: LinkIcon }[] = [
  { href: siteConfig.links.github, label: "GitHub", icon: GithubIcon },
  { href: siteConfig.links.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { href: siteConfig.links.portfolio, label: "Portfolio", icon: Globe },
  { href: siteConfig.links.instagram, label: "Instagram", icon: InstagramIcon },
  { href: siteConfig.links.email, label: "Email", icon: Mail },
];

async function CopyrightLine() {
  await io();
  return <p>{`© ${new Date().getFullYear()} ${siteConfig.author}. All rights reserved.`}</p>;
}

export function Footer() {
  return (
    <div className="mt-auto">
      <footer className="border-t">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3">
          <div>
            <p className="text-sm">
              <Wordmark />
            </p>
            <p className="text-muted-foreground mt-2 text-sm leading-6">{siteConfig.description}</p>
            <p className="mt-3 text-sm leading-6">Your files never leave your device.</p>
            <Link
              href="/privacy"
              className="hover:text-foreground focus-visible:outline-ring mt-4 inline-flex rounded-sm text-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Privacy policy
            </Link>
          </div>
          <div>
            <h2 className="text-sm font-semibold">Connect</h2>
            <ul className="mt-3 space-y-2">
              {connectLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="text-muted-foreground hover:text-foreground focus-visible:outline-ring inline-flex items-center gap-2 rounded-sm text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold">Support</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-6">Enjoying this free tool? Support its development.</p>
            <div className="mt-4">
              <BuyMeCoffeeButton />
            </div>
          </div>
        </div>
      </footer>
      <div className="border-t px-4 py-4 text-center text-sm">
        <Suspense fallback={<p>{`© ${siteConfig.author}. All rights reserved.`}</p>}>
          <CopyrightLine />
        </Suspense>
      </div>
    </div>
  );
}
