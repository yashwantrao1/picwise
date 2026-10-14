"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { toast } from "sonner";
import { detectFormat } from "@/lib/codecs/detect";
import { readImageSize } from "@/lib/codecs/dimensions";
import { createId, errorMessage } from "@/lib/utils";
import { formatBytes } from "@/lib/utils/bytes";
import {
  BATCH_MEMORY_WARNING_BYTES,
  LARGE_FILE_BYTES,
  MAX_BATCH_FILES,
  MAX_FILE_BYTES,
  estimateDecodedBytes,
} from "@/lib/utils/memory";
import { useConverterStore } from "@/store/converter-store";
import type { InputFormat, SourceFile } from "@/types";

interface IntakeApi {
  isDragging: boolean;
  openFiles: () => void;
  openFolder: () => void;
  onFileChange: (files: FileList | null) => void;
}

async function readDirectory(reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> {
  const entries: FileSystemEntry[] = [];
  while (true) {
    const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });
    if (batch.length === 0) return entries;
    entries.push(...batch);
  }
}

async function entryToFiles(entry: FileSystemEntry): Promise<File[]> {
  if (entry.isFile) {
    const file = await new Promise<File>((resolve, reject) => {
      (entry as FileSystemFileEntry).file(resolve, reject);
    });
    return [file];
  }
  if (!entry.isDirectory) return [];
  const reader = (entry as FileSystemDirectoryEntry).createReader();
  const children = await readDirectory(reader);
  const nested = await Promise.all(children.map((child) => entryToFiles(child)));
  return nested.flat();
}

async function filesFromTransfer(transfer: DataTransfer): Promise<File[]> {
  const entries: FileSystemEntry[] = [];
  for (const item of transfer.items) {
    const entry = item.webkitGetAsEntry?.();
    if (entry) entries.push(entry);
  }
  if (entries.length === 0) return Array.from(transfer.files);
  const groups = await Promise.all(entries.map((entry) => entryToFiles(entry)));
  return groups.flat();
}

async function sniff(file: File): Promise<{ format: InputFormat | null; width: number | null; height: number | null }> {
  const length = Math.min(file.size, 5 * 1024 * 1024);
  const bytes = new Uint8Array(await file.slice(0, length).arrayBuffer());
  const format = detectFormat(bytes, file.name, file.type);
  const size = format ? readImageSize(bytes, format) : null;
  return { format, width: size?.width ?? null, height: size?.height ?? null };
}

async function createThumbnail(file: File): Promise<string | null> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
      resizeWidth: 480,
      resizeQuality: "medium",
    });
    try {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, bitmap.width);
      canvas.height = Math.max(1, bitmap.height);
      const context = canvas.getContext("2d");
      if (!context) return null;
      context.drawImage(bitmap, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      return blob ? URL.createObjectURL(blob) : null;
    } finally {
      bitmap.close();
    }
  } catch {
    return null;
  }
}

async function mapLimited<T>(items: T[], limit: number, task: (item: T) => Promise<void>): Promise<void> {
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      if (current) await task(current);
    }
  });
  await Promise.all(workers);
}

export function useFileIntake(
  fileInputRef: RefObject<HTMLInputElement | null>,
  folderInputRef: RefObject<HTMLInputElement | null>,
): IntakeApi {
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0);

  const addFiles = useCallback(async (incoming: File[]) => {
    const store = useConverterStore.getState();
    const room = MAX_BATCH_FILES - store.files.length;
    if (room <= 0) {
      toast.error(`You can add up to ${MAX_BATCH_FILES} images at a time.`);
      return;
    }
    const unique = incoming.filter((file) => file.size > 0);
    const accepted = unique.slice(0, room);
    if (unique.length > accepted.length) {
      toast.warning(`Only the first ${MAX_BATCH_FILES} images were added.`);
    }
    const placeholders: SourceFile[] = [];
    let skipped = 0;
    let large = 0;
    for (const file of accepted) {
      if (file.size > MAX_FILE_BYTES) {
        skipped += 1;
        continue;
      }
      if (file.size > LARGE_FILE_BYTES) large += 1;
      placeholders.push({
        id: createId(),
        file,
        name: file.name || "image",
        size: file.size,
        format: null,
        width: null,
        height: null,
        previewUrl: URL.createObjectURL(file),
        thumbnailUrl: null,
        status: "reading",
        progress: 0,
        error: null,
        result: null,
      });
    }
    if (placeholders.length === 0) {
      toast.error(skipped > 0 ? "Those files are too large or empty." : "No images found.");
      return;
    }
    useConverterStore.getState().addFiles(placeholders);
    if (large > 0) {
      toast.warning(
        large === 1
          ? "One file is over 50 MB. It will use a lot of memory."
          : `${large} files are over 50 MB and will use a lot of memory.`,
      );
    }
    if (skipped > 0) toast.error(`${skipped} file${skipped === 1 ? "" : "s"} over ${formatBytes(MAX_FILE_BYTES)} were skipped.`);

    let unsupported = 0;

    await mapLimited(placeholders, 3, async (placeholder) => {
      const stillThere = useConverterStore.getState().files.some((file) => file.id === placeholder.id);
      if (!stillThere) {
        if (placeholder.previewUrl) URL.revokeObjectURL(placeholder.previewUrl);
        return;
      }
      try {
        const meta = await sniff(placeholder.file);
        if (!meta.format) {
          unsupported += 1;
          useConverterStore.getState().removeFile(placeholder.id);
          return;
        }
        let width = meta.width;
        let height = meta.height;
        if ((!width || !height) && placeholder.file.size < 25 * 1024 * 1024 && meta.format !== "heic") {
          try {
            const bitmap = await createImageBitmap(placeholder.file, { imageOrientation: "from-image" });
            width = bitmap.width;
            height = bitmap.height;
            bitmap.close();
          } catch {
            width = meta.width;
            height = meta.height;
          }
        }
        const thumbnailUrl = await createThumbnail(placeholder.file);
        if (!useConverterStore.getState().files.some((file) => file.id === placeholder.id)) {
          if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
          if (placeholder.previewUrl) URL.revokeObjectURL(placeholder.previewUrl);
          return;
        }
        useConverterStore.getState().updateFile(placeholder.id, {
          format: meta.format,
          width,
          height,
          thumbnailUrl,
          status: "ready",
        });
      } catch (error) {
        useConverterStore.getState().updateFile(placeholder.id, {
          status: "error",
          error: errorMessage(error),
        });
      }
    });

    if (unsupported > 0) {
      toast.error(
        unsupported === 1 ? "1 unsupported file was skipped." : `${unsupported} unsupported files were skipped.`,
      );
    }
    const decodedBytes = useConverterStore.getState().files.reduce((total, file) => {
      return total + estimateDecodedBytes(file.width, file.height, file.size);
    }, 0);
    if (decodedBytes > BATCH_MEMORY_WARNING_BYTES) {
      toast.warning("This batch may use more than 1.5 GB of memory when decoded. Convert in smaller groups if the tab slows down.");
    }
  }, []);

  useEffect(() => {
    const onDragEnter = (event: DragEvent) => {
      event.preventDefault();
      dragDepth.current += 1;
      setIsDragging(true);
    };
    const onDragOver = (event: DragEvent) => {
      event.preventDefault();
    };
    const onDragLeave = (event: DragEvent) => {
      event.preventDefault();
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) setIsDragging(false);
    };
    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      dragDepth.current = 0;
      setIsDragging(false);
      if (!event.dataTransfer) return;
      void filesFromTransfer(event.dataTransfer)
        .then((files) => addFiles(files))
        .catch((error: unknown) => toast.error(errorMessage(error)));
    };
    const onPaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (const item of items) {
        if (!item.type.startsWith("image/")) continue;
        const file = item.getAsFile();
        if (file) files.push(file);
      }
      if (files.length === 0) return;
      event.preventDefault();
      void addFiles(files);
    };
    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("paste", onPaste);
    };
  }, [addFiles]);

  return {
    isDragging,
    openFiles: () => fileInputRef.current?.click(),
    openFolder: () => folderInputRef.current?.click(),
    onFileChange: (files) => {
      if (!files || files.length === 0) return;
      void addFiles(Array.from(files));
    },
  };
}
