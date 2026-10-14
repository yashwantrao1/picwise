import { OUTPUT_EXTENSION, outputUsesQuality } from "@/lib/utils/formats";
import { planResize } from "@/lib/utils/resize";
import type { ConverterSettings, OutputFormat } from "@/types";

export function estimateOutputBytes(options: {
  srcWidth: number;
  srcHeight: number;
  srcBytes: number;
  settings: ConverterSettings;
}): number {
  const plan = planResize({
    srcWidth: options.srcWidth,
    srcHeight: options.srcHeight,
    mode: options.settings.resizeMode,
    width: options.settings.width,
    height: options.settings.resizeMode === "dimensions" ? 0 : options.settings.height,
    percentage: options.settings.percentage,
    fit: options.settings.fit,
    allowUpscale: options.settings.allowUpscale,
    lockAspect: options.settings.resizeMode === "dimensions" ? true : options.settings.lockAspect,
  });
  const pixels = Math.max(1, plan.canvasWidth * plan.canvasHeight);
  const quality = Math.min(100, Math.max(1, options.settings.quality)) / 100;
  const format = options.settings.outputFormat;
  const estimated = bytesForFormat(format, pixels, quality, options.srcBytes);
  if (options.settings.targetSizeEnabled && outputUsesQuality(format)) {
    return Math.min(estimated, options.settings.targetSizeKB * 1024);
  }
  return Math.max(1, Math.round(estimated));
}

function bytesForFormat(format: OutputFormat, pixels: number, quality: number, srcBytes: number): number {
  switch (format) {
    case "jpg":
      return pixels * (0.04 + 0.4 * quality);
    case "webp":
      return pixels * (0.03 + 0.28 * quality);
    case "avif":
      return pixels * (0.02 + 0.18 * quality);
    case "png":
      return Math.min(Math.max(srcBytes * 0.85, pixels * 0.35), pixels * 1.5);
    case "gif":
      return pixels * 0.35;
    case "bmp":
      return pixels * 3 + 54;
    case "ico":
      return Math.min(pixels * 0.6, 512 * 1024);
    default:
      return srcBytes;
  }
}

export function estimateExtension(format: OutputFormat): string {
  return OUTPUT_EXTENSION[format];
}
