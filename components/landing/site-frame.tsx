import { INPUT_FORMATS } from "@/types";
import { FORMAT_LABEL } from "@/lib/utils/formats";

export function SiteFrame() {
  return (
    <nav aria-label="Source formats" className="bg-background sticky top-14 z-30 min-w-0 border-b">
      <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 py-2 font-mono text-xs sm:px-6">
        {INPUT_FORMATS.map((format) => (
          <a key={format} href={`/#from-${format}`} className="text-muted-foreground hover:text-foreground focus-visible:outline-ring shrink-0 rounded-sm py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            {FORMAT_LABEL[format]}
          </a>
        ))}
      </div>
    </nav>
  );
}
