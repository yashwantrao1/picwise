import type { JsonLdDocument } from "@/lib/seo/schema";

export function JsonLd({ data }: { data: JsonLdDocument }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
