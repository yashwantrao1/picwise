import { Coffee } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface BuyMeCoffeeButtonProps {
  variant?: "default" | "compact";
}

export function BuyMeCoffeeButton({ variant = "default" }: BuyMeCoffeeButtonProps) {
  const compact = variant === "compact";

  return (
    <a
      href={siteConfig.links.buyMeACoffee}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a coffee"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 font-medium text-amber-950 transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700",
        compact ? "size-10 sm:h-10 sm:w-auto sm:px-3 sm:text-sm" : "h-10 w-full px-4 text-sm sm:w-auto",
      )}
    >
      <Coffee className="size-4 shrink-0" aria-hidden="true" />
      <span className={compact ? "hidden sm:inline" : undefined}>{compact ? "Coffee" : "Buy me a coffee"}</span>
    </a>
  );
}
