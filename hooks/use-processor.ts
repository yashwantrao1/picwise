"use client";

import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { downloadBlob } from "@/lib/utils/download";
import { OUTPUT_EXTENSION } from "@/lib/utils/formats";
import { allocateFilename } from "@/lib/utils/filename";
import { workerCount } from "@/lib/utils/memory";
import { zipBlobs } from "@/lib/utils/zip";
import { errorMessage } from "@/lib/utils";
import { useConverterStore } from "@/store/converter-store";
import { WorkerPool } from "@/workers/pool";

const PROCESSABLE = new Set(["ready", "done", "error", "cancelled"]);

export function useProcessor() {
  const poolRef = useRef<WorkerPool | null>(null);
  const runId = useRef(0);

  useEffect(() => {
    const pool = new WorkerPool();
    poolRef.current = pool;
    return () => {
      pool.terminate();
      poolRef.current = null;
    };
  }, []);

  const cancel = useCallback(() => {
    runId.current += 1;
    poolRef.current?.cancelAll();
    const { files, updateFile, setRunning } = useConverterStore.getState();
    for (const file of files) {
      if (file.status === "queued" || file.status === "processing") {
        updateFile(file.id, { status: "cancelled", progress: 0, error: null });
      }
    }
    setRunning(false);
  }, []);

  const cancelOne = useCallback((id: string) => {
    poolRef.current?.cancel(id);
  }, []);

  const start = useCallback(async (ids?: string[]) => {
    const pool = poolRef.current;
    if (!pool) return;
    const state = useConverterStore.getState();
    if (state.running) return;
    const selected = state.files.filter((file) => {
      if (ids && !ids.includes(file.id)) return false;
      return PROCESSABLE.has(file.status);
    });
    if (selected.length === 0) {
      toast.error("Add an image before converting.");
      return;
    }
    const token = runId.current + 1;
    runId.current = token;
    const settings = state.settings;
    state.setRunning(true);
    const used = new Set<string>();
    const names = new Map<string, string>();
    for (const file of selected) {
      names.set(
        file.id,
        allocateFilename(
          file.name,
          OUTPUT_EXTENSION[settings.outputFormat],
          settings.filenamePrefix,
          settings.filenameSuffix,
          used,
        ),
      );
      state.updateFile(file.id, { status: "queued", progress: 0, error: null, result: null });
    }

    let failed = 0;
    let cursor = 0;
    const limit = Math.min(workerCount(navigator.hardwareConcurrency), selected.length);
    const work = async () => {
      while (cursor < selected.length) {
        if (runId.current !== token) return;
        const file = selected[cursor];
        cursor += 1;
        if (!file) return;
        const latest = useConverterStore.getState().files.find((item) => item.id === file.id);
        if (!latest || latest.status === "cancelled") continue;
        useConverterStore.getState().updateFile(file.id, { status: "processing", progress: 4 });
        try {
          const buffer = await latest.file.arrayBuffer();
          if (runId.current !== token) return;
          const result = await pool.run({
            jobId: file.id,
            buffer,
            name: latest.name,
            mime: latest.file.type,
            settings,
            onProgress: (progress) => {
              if (runId.current !== token) return;
              useConverterStore.getState().updateFile(file.id, { progress });
            },
          });
          if (runId.current !== token) return;
          const bytes = new Uint8Array(result.buffer);
          const blob = new Blob([bytes], { type: result.mime });
          useConverterStore.getState().updateFile(file.id, {
            status: "done",
            progress: 100,
            error: result.withinTarget ? null : "Could not get under the target size. This is the smallest result.",
            result: {
              url: URL.createObjectURL(blob),
              size: bytes.byteLength,
              width: result.width,
              height: result.height,
              filename: names.get(file.id) ?? `image.${result.extension}`,
              blob,
              withinTarget: result.withinTarget,
            },
          });
        } catch (error) {
          if (runId.current !== token) return;
          const message = errorMessage(error);
          const wasCancelled = error instanceof Error && error.name === "CancelledError";
          if (!wasCancelled) failed += 1;
          useConverterStore.getState().updateFile(file.id, {
            status: wasCancelled ? "cancelled" : "error",
            progress: 0,
            error: wasCancelled ? null : message,
          });
        }
      }
    };

    await Promise.all(Array.from({ length: limit }, () => work()));
    if (runId.current !== token) return;
    useConverterStore.getState().setRunning(false);
    if (failed > 0) {
      toast.error(failed === 1 ? "1 image failed. You can retry it." : `${failed} images failed. You can retry them.`);
    }
  }, []);

  const downloadAll = useCallback(async () => {
    const { files, setZipping, zipping } = useConverterStore.getState();
    if (zipping) return;
    const ready = files.flatMap((file) => (file.result ? [{ name: file.result.filename, blob: file.result.blob }] : []));
    if (ready.length === 0) {
      toast.error("Convert at least one image before downloading.");
      return;
    }
    setZipping(true);
    try {
      const blob = await zipBlobs(ready);
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `anyconvert-${stamp}.zip`);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      useConverterStore.getState().setZipping(false);
    }
  }, []);

  return { start, cancel, cancelOne, downloadAll };
}
