import { decodeToBitmap } from "@/lib/codecs/decode";
import { encodeImage } from "@/lib/codecs/encode";
import { transplantJpegExif } from "@/lib/codecs/dimensions";
import { ICO_MAX_EDGE, MAX_PIXELS } from "@/lib/utils/memory";
import { outputSupportsAlpha, parseHexColor } from "@/lib/utils/formats";
import { limitLongestEdge, planResize } from "@/lib/utils/resize";
import type { ConverterSettings, ProcessOutput } from "@/types";

export interface ProcessHooks {
  onProgress: (progress: number) => void;
  isCancelled: () => boolean;
}

function cancelled(): Error {
  const error = new Error("Cancelled");
  error.name = "CancelledError";
  return error;
}

export async function processImageBytes(
  bytes: Uint8Array,
  name: string,
  mime: string,
  settings: ConverterSettings,
  hooks: ProcessHooks,
): Promise<ProcessOutput> {
  if (hooks.isCancelled()) throw cancelled();
  hooks.onProgress(8);
  const bitmap = await decodeToBitmap(bytes, name, mime);
  try {
    if (hooks.isCancelled()) throw cancelled();
    if (bitmap.width * bitmap.height > MAX_PIXELS) {
      throw new Error("This image is too large to process safely (over 120 megapixels).");
    }
    hooks.onProgress(28);
    let plan = planResize({
      srcWidth: bitmap.width,
      srcHeight: bitmap.height,
      mode: settings.resizeMode,
      width: settings.width,
      height: settings.resizeMode === "dimensions" ? 0 : settings.height,
      percentage: settings.percentage,
      fit: settings.fit,
      allowUpscale: settings.allowUpscale,
      lockAspect: settings.resizeMode === "dimensions" ? true : settings.lockAspect,
    });
    if (settings.outputFormat === "ico") plan = limitLongestEdge(plan, ICO_MAX_EDGE);

    const canvas = new OffscreenCanvas(plan.canvasWidth, plan.canvasHeight);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("This browser cannot draw images off the main thread.");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    if (!outputSupportsAlpha(settings.outputFormat)) {
      context.fillStyle = parseHexColor(settings.backgroundColor);
      context.fillRect(0, 0, plan.canvasWidth, plan.canvasHeight);
    }
    context.drawImage(bitmap, plan.sx, plan.sy, plan.sw, plan.sh, plan.dx, plan.dy, plan.dw, plan.dh);
    const image = context.getImageData(0, 0, plan.canvasWidth, plan.canvasHeight);
    hooks.onProgress(42);
    if (hooks.isCancelled()) throw cancelled();

    const encoded = await encodeImage(image, canvas, settings, hooks.onProgress);
    let output = encoded.bytes;
    if (!settings.stripExif && settings.outputFormat === "jpg") {
      output = transplantJpegExif(bytes, output);
    }
    hooks.onProgress(100);
    return {
      bytes: output,
      mime: encoded.mime,
      extension: encoded.extension,
      width: plan.canvasWidth,
      height: plan.canvasHeight,
      withinTarget: encoded.withinTarget,
    };
  } finally {
    bitmap.close();
  }
}
