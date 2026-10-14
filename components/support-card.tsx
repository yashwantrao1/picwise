import { Coffee, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee-button";
import { GithubIcon, LinkedinIcon } from "@/components/social-icons";
import { siteConfig } from "@/lib/site-config";

type LinkIcon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

const profileLinks: readonly { href: string; label: string; icon: LinkIcon }[] = [
  { href: siteConfig.links.github, label: "GitHub", icon: GithubIcon },
  { href: siteConfig.links.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { href: siteConfig.links.portfolio, label: "Portfolio", icon: Globe },
];

export function SupportCard() {
  return (
    <section className="bg-card rounded-xl border p-4" aria-labelledby="support-card-heading">
      <div className="flex items-start gap-3">
        <Coffee className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
        <div>
          <h2 id="support-card-heading" className="text-sm font-semibold">
            Like this tool?
          </h2>
          <p className="text-muted-foreground mt-1 text-sm leading-6">It&apos;s free and private. A coffee helps me keep it that way.</p>
        </div>
      </div>
      <div className="mt-4">
        <BuyMeCoffeeButton />
      </div>
      <ul className="mt-3 flex gap-1">
        {profileLinks.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-ring inline-flex size-10 items-center justify-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
