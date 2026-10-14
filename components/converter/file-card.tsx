"use client";

import { AlertTriangle, Download, ImageOff, RotateCcw, X } from "lucide-react";
import { memo, useState } from "react";
import { ComparisonSlider } from "@/components/converter/comparison-slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatBytes, formatSavings } from "@/lib/utils/bytes";
import { FORMAT_LABEL } from "@/lib/utils/formats";
import { downloadBlob } from "@/lib/utils/download";
import type { SourceFile } from "@/types";

interface FileCardProps {
  file: SourceFile;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  disabled: boolean;
}

function dimensionLabel(width: number | null, height: number | null): string {
  if (!width || !height) return "Reading size";
  return `${width}×${height}`;
}

export const FileCard = memo(function FileCard({ file, onRemove, onRetry, disabled }: FileCardProps) {
  const [compare, setCompare] = useState(false);
  const [beforeSrc, setBeforeSrc] = useState(file.previewUrl ?? file.thumbnailUrl);
  const savings = file.result ? formatSavings(file.size, file.result.size) : null;
  const preview = file.thumbnailUrl ?? file.previewUrl;

  return (
    <article className="bg-card flex flex-col overflow-hidden rounded-xl border shadow-sm">
      <div className="bg-muted relative aspect-[4/3]">
        {preview ? (
          <img src={preview} alt={`Preview of ${file.name}`} className="h-full w-full object-contain" />
        ) : (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-sm">
            {file.status === "reading" ? (
              <span className="bg-foreground/10 size-16 animate-pulse rounded-md" />
            ) : (
              <>
                <ImageOff aria-hidden />
                No preview
              </>
            )}
          </div>
        )}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 size-8"
          aria-label={`Remove ${file.name}`}
          onClick={() => onRemove(file.id)}
        >
          <X />
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium" title={file.name}>
            {file.name}
          </h3>
          <p className="text-muted-foreground mt-1 text-xs">
            {file.format ? FORMAT_LABEL[file.format] : "Detecting"} · {dimensionLabel(file.width, file.height)} · {formatBytes(file.size)}
          </p>
        </div>

        {(file.status === "processing" || file.status === "queued") && (
          <div className="space-y-1">
            <Progress value={file.progress} aria-label={`Progress for ${file.name}`} aria-valuenow={file.progress} />
            <p className="text-muted-foreground text-xs">{file.status === "queued" ? "Waiting" : `${Math.round(file.progress)}%`}</p>
          </div>
        )}

        {file.status === "error" && (
          <div className="bg-destructive/10 text-destructive flex items-start gap-2 rounded-md p-2 text-xs" role="alert">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <span>{file.error ?? "This file could not be converted."}</span>
          </div>
        )}

        {file.status === "cancelled" && <p className="text-muted-foreground text-xs">Cancelled</p>}

        {file.result && savings && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span>{formatBytes(file.result.size)}</span>
              <Badge variant={savings.tone === "positive" ? "positive" : savings.tone === "negative" ? "warning" : "secondary"}>
                {savings.label}
              </Badge>
              <span className="text-muted-foreground">
                {file.result.width}×{file.result.height}
              </span>
            </div>
            {file.error && <p className="text-warning text-xs">{file.error}</p>}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadBlob(file.result!.blob, file.result!.filename)}
              >
                <Download />
                Download
              </Button>
              <Button size="sm" variant="ghost" aria-expanded={compare} onClick={() => setCompare((open) => !open)}>
                {compare ? "Hide comparison" : "Compare"}
              </Button>
            </div>
            {compare && beforeSrc && (
              <ComparisonSlider
                before={beforeSrc}
                after={file.result.url}
                beforeLabel="Original"
                afterLabel="Result"
              />
            )}
            {compare && beforeSrc === file.previewUrl && file.thumbnailUrl && (
              <img src={file.previewUrl ?? undefined} alt="" className="hidden" onError={() => setBeforeSrc(file.thumbnailUrl)} />
            )}
          </div>
        )}

        {(file.status === "error" || file.status === "cancelled") && (
          <Button size="sm" variant="outline" disabled={disabled} onClick={() => onRetry(file.id)}>
            <RotateCcw />
            Retry
          </Button>
        )}
      </div>
    </article>
  );
});
