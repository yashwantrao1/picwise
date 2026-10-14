"use client";

import { Download, Loader2, Trash2, Wand2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { DropZone } from "@/components/converter/drop-zone";
import { FileCard } from "@/components/converter/file-card";
import { PrivacyNote } from "@/components/converter/privacy-note";
import { SettingsPanel } from "@/components/converter/settings-panel";
import { SupportCard } from "@/components/support-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFileIntake } from "@/hooks/use-file-intake";
import { useProcessor } from "@/hooks/use-processor";
import { formatBytes, formatSavings } from "@/lib/utils/bytes";
import { siteConfig } from "@/lib/site-config";
import { FORMAT_LABEL } from "@/lib/utils/formats";
import { hydrateConverter, useConverterStore } from "@/store/converter-store";

export function ConverterApp() {
  const files = useConverterStore((state) => state.files);
  const running = useConverterStore((state) => state.running);
  const zipping = useConverterStore((state) => state.zipping);
  const routeHint = useConverterStore((state) => state.routeHint);
  const removeFile = useConverterStore((state) => state.removeFile);
  const clearFiles = useConverterStore((state) => state.clearFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const intake = useFileIntake(fileInputRef, folderInputRef);
  const processor = useProcessor();

  useEffect(() => {
    void hydrateConverter();
  }, []);

  const convertible = files.some((file) => file.status === "ready" || file.status === "done" || file.status === "error" || file.status === "cancelled");
  const results = files.filter((file) => file.result);
  const originalTotal = results.reduce((total, file) => total + file.size, 0);
  const nextTotal = results.reduce((total, file) => total + (file.result?.size ?? 0), 0);
  const savings = results.length > 0 ? formatSavings(originalTotal, nextTotal) : null;
  const overall = files.length === 0 ? 0 : Math.round(files.reduce((total, file) => total + file.progress, 0) / files.length);
  const active = files.some((file) => file.status === "processing" || file.status === "queued");

  return (
    <div id="convert" className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-primary text-sm font-medium tracking-wide">
            <Link href="/" className="hover:underline">
              {siteConfig.name}
            </Link>
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {routeHint
              ? `${FORMAT_LABEL[routeHint.from]} to ${FORMAT_LABEL[routeHint.to]} convertor in bulk`
              : "Convert and compress images privately"}
          </h1>
          <PrivacyNote />
        </div>       
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          <DropZone
            isDragging={intake.isDragging}
            hasFiles={files.length > 0}
            onBrowse={intake.openFiles}
            onFolder={intake.openFolder}
          />
          <input
            ref={fileInputRef}
            className="sr-only"
            type="file"
            multiple
            accept="image/*,.heic,.heif,.tif,.tiff,.svg,.ico,.bmp,.avif,.webp"
            aria-label="Choose images"
            onChange={(event) => {
              intake.onFileChange(event.target.files);
              event.target.value = "";
            }}
          />
          <input
            ref={folderInputRef}
            className="sr-only"
            type="file"
            multiple
            accept="image/*,.heic,.heif,.tif,.tiff,.svg,.ico,.bmp,.avif,.webp"
            aria-label="Choose a folder of images"
            {...{ webkitdirectory: "", directory: "" }}
            onChange={(event) => {
              intake.onFileChange(event.target.files);
              event.target.value = "";
            }}
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => void processor.start()} disabled={!convertible || running}>
              {running ? <Loader2 className="motion-safe:animate-spin" /> : <Wand2 />}
              {running ? "Converting" : "Convert"}
            </Button>
            <Button variant="outline" onClick={processor.cancel} disabled={!active}>
              <XCircle />
              Cancel
            </Button>
            <Button variant="outline" onClick={() => void processor.downloadAll()} disabled={results.length === 0 || zipping}>
              {zipping ? <Loader2 className="motion-safe:animate-spin" /> : <Download />}
              Download all as ZIP
            </Button>
            <Button variant="ghost" onClick={clearFiles} disabled={files.length === 0 || running}>
              <Trash2 />
              Clear all
            </Button>
            <p className="text-muted-foreground ml-auto text-sm" aria-live="polite">
              {files.length === 0 ? "No images yet" : `${files.length} image${files.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {(active || results.length > 0) && (
            <div className="bg-card space-y-3 rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-medium">Batch progress</h2>
                {savings && (
                  <p className="text-sm">
                    {formatBytes(originalTotal)} to {formatBytes(nextTotal)} ·{" "}
                    <span className={savings.tone === "positive" ? "text-positive" : savings.tone === "negative" ? "text-warning" : ""}>
                      {savings.label}
                    </span>
                  </p>
                )}
              </div>
              <Progress value={active ? overall : results.length === files.length && files.length > 0 ? 100 : overall} aria-label="Overall progress" />
            </div>
          )}

          {files.length === 0 ? (
            <div className="text-muted-foreground rounded-xl border border-dashed px-4 py-10 text-center text-sm">
              Nothing here yet. Add images to see thumbnails, sizes, and dimensions.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  disabled={running}
                  onRemove={(id) => {
                    processor.cancelOne(id);
                    removeFile(id);
                  }}
                  onRetry={(id) => void processor.start([id])}
                />
              ))}
            </div>
          )}
        </div>
        <aside className="flex flex-col gap-4 lg:sticky lg:top-16  lg:overflow-y-auto">
          <SettingsPanel />
          <SupportCard />
        </aside>
      </div>

      <footer className="text-muted-foreground space-y-2 border-t pt-4 text-xs">
        <p>
          GIF, animated WebP, and HEIC sequences use the first frame. SVG files are rasterized. ICO output is capped at 256 pixels. Very large files stay on this device, but they can still use a lot of memory.
        </p>
      </footer>
    </div>
  );
}
