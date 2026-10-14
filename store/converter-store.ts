"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ConverterSettings, InputFormat, OutputFormat, SourceFile } from "@/types";

export const defaultSettings: ConverterSettings = {
  outputFormat: "webp",
  quality: 80,
  pngQuantize: false,
  pngColors: 256,
  resizeMode: "none",
  width: 1920,
  height: 1080,
  lockAspect: true,
  fit: "contain",
  allowUpscale: false,
  percentage: 80,
  targetSizeEnabled: false,
  targetSizeKB: 200,
  stripExif: true,
  backgroundColor: "#ffffff",
  filenamePrefix: "",
  filenameSuffix: "-compressed",
};

export interface RouteHint {
  from: InputFormat;
  to: OutputFormat;
}

interface ConverterState {
  files: SourceFile[];
  settings: ConverterSettings;
  routeHint: RouteHint | null;
  running: boolean;
  zipping: boolean;
  setRouteHint: (hint: RouteHint | null) => void;
  setRunning: (value: boolean) => void;
  setZipping: (value: boolean) => void;
  updateSettings: (patch: Partial<ConverterSettings>) => void;
  resetSettings: () => void;
  addFiles: (files: SourceFile[]) => void;
  updateFile: (id: string, patch: Partial<SourceFile>) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
}

function revokeFile(file: SourceFile): void {
  if (typeof URL === "undefined") return;
  if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
  if (file.thumbnailUrl) URL.revokeObjectURL(file.thumbnailUrl);
  if (file.result) URL.revokeObjectURL(file.result.url);
}

let hydration: Promise<void> | null = null;

export function hydrateConverter(): Promise<void> {
  hydration ??= Promise.resolve(useConverterStore.persist.rehydrate()).then(() => undefined);
  return hydration;
}

export const useConverterStore = create<ConverterState>()(
  persist(
    (set, get) => ({
      files: [],
      settings: defaultSettings,
      routeHint: null,
      running: false,
      zipping: false,
      setRouteHint: (routeHint) => set({ routeHint }),
      setRunning: (running) => set({ running }),
      setZipping: (zipping) => set({ zipping }),
      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      resetSettings: () => set({ settings: defaultSettings }),
      addFiles: (files) => set({ files: [...get().files, ...files] }),
      updateFile: (id, patch) => {
        const current = get().files.find((file) => file.id === id);
        if (!current) {
          if (patch.previewUrl) URL.revokeObjectURL(patch.previewUrl);
          if (patch.thumbnailUrl) URL.revokeObjectURL(patch.thumbnailUrl);
          if (patch.result) URL.revokeObjectURL(patch.result.url);
          return;
        }
        set({
          files: get().files.map((file) => {
            if (file.id !== id) return file;
            if ("result" in patch && file.result && file.result.url !== patch.result?.url) {
              URL.revokeObjectURL(file.result.url);
            }
            if ("thumbnailUrl" in patch && file.thumbnailUrl && file.thumbnailUrl !== patch.thumbnailUrl) {
              URL.revokeObjectURL(file.thumbnailUrl);
            }
            return { ...file, ...patch };
          }),
        });
      },
      removeFile: (id) => {
        const file = get().files.find((item) => item.id === id);
        if (file) revokeFile(file);
        set({ files: get().files.filter((item) => item.id !== id) });
      },
      clearFiles: () => {
        for (const file of get().files) revokeFile(file);
        set({ files: [] });
      },
    }),
    {
      name: "anyconvert-settings",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);
