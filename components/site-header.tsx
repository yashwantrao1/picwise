"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee-button";
import { ThemeToggle } from "@/components/converter/theme-toggle";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";

const linkClass =
  "hover:text-foreground focus-visible:outline-ring rounded-sm text-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Link href="/convertor" className={linkClass} onClick={onNavigate}>
        Compress
      </Link>
      <Link href="/convertor" className={linkClass} onClick={onNavigate}>
        Convert
      </Link>
      <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
        Remove background
        <span className="border px-1.5 py-0.5 font-mono text-[10px] tracking-wide uppercase">Upcoming</span>
      </span>
    </>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="bg-background sticky top-0 z-40 border-b"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="focus-visible:outline-ring inline-flex min-w-0 items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={() => setOpen(false)}
        >
          <img src="/picwise-brand-kit/picwise-logo-icon.svg" alt="" width={32} height={32} className="size-8 shrink-0" />
          <Wordmark className="text-base" />
        </Link>
        <div className="flex items-center gap-2">
          <nav aria-label="Site" className="hidden items-center gap-3 md:flex">
            <NavLinks />
            <ThemeToggle />
          </nav>
          <BuyMeCoffeeButton variant="compact" />
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open ? (
        <nav id="site-menu" aria-label="Site" className="border-t px-4 py-3 md:hidden">
          <div className="flex flex-col items-start gap-4">
            <NavLinks onNavigate={() => setOpen(false)} />
            <ThemeToggle />
          </div>
        </nav>
      ) : null}
    </header>
  );
}
