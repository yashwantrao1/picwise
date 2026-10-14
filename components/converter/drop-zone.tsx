"use client";

import { FolderUp, ImagePlus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  isDragging: boolean;
  hasFiles: boolean;
  onBrowse: () => void;
  onFolder: () => void;
}

export function DropZone({ isDragging, hasFiles, onBrowse, onFolder }: DropZoneProps) {
  return (
    <section
      aria-label="Upload images"
      className={cn(
        "rounded-2xl border border-dashed px-5 py-8 text-center transition-colors",
        isDragging ? "border-primary bg-primary/10" : "border-border bg-card/60",
        hasFiles ? "py-5" : "py-12",
      )}
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
          <Upload aria-hidden />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{hasFiles ? "Add more images" : "Drop images to convert"}</h2>
          <p className="text-muted-foreground text-sm">
            Drag and drop files or folders, paste from the clipboard, or browse. PNG, JPG, WebP, AVIF, GIF, BMP, TIFF, SVG, ICO, and HEIC.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button onClick={onBrowse}>
            <ImagePlus />
            Choose files
          </Button>
          <Button variant="outline" onClick={onFolder}>
            <FolderUp />
            Choose folder
          </Button>
        </div>
      </div>
    </section>
  );
}
