import type { Metadata } from "next";
import { Suspense } from "react";
import { ApplyPreset } from "@/components/converter/apply-preset";
import { ConverterApp } from "@/components/converter/converter-app";
import { ConvertorGuide } from "@/components/converter/convertor-guide";

export const metadata: Metadata = {
  title: "Bulk image convertor",
  description:
    "Convert and compress PNG, JPG, WebP, AVIF, GIF, BMP, TIFF, SVG, ICO, and HEIC images in bulk. Processing stays in your browser.",
  alternates: { canonical: "/convertor" },
};

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

async function ConvertorQuery({
  searchParams,
}: {
  searchParams: Promise<{ from?: string | string[]; to?: string | string[] }>;
}) {
  const params = await searchParams;
  return <ApplyPreset from={firstParam(params.from)} to={firstParam(params.to)} />;
}

export default function ConvertorPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string | string[]; to?: string | string[] }>;
}) {
  return (
    <main id="main" className="flex flex-1 flex-col">
      <Suspense fallback={null}>
        <ConvertorQuery searchParams={searchParams} />
      </Suspense>
      <ConverterApp />
      <ConvertorGuide searchParams={searchParams} />
    </main>
  );
}
