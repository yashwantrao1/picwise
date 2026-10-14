import { encodeBmp } from "@/lib/codecs/bmp";
import { loadCodec, type CodecEncodeModule, type OxipngModule } from "@/lib/codecs/runtime";
import { trimEncoded } from "@/lib/codecs/trim";
import { encodeIco } from "@/lib/codecs/ico";
import { asBytes, cloneImageData } from "@/lib/codecs/image-data";
import { encodeIndexedPng, imageHasAlpha } from "@/lib/codecs/png-indexed";
import { encodeGif, quantizeRgba } from "@/lib/codecs/quantize";
import { OUTPUT_EXTENSION, OUTPUT_MIME, outputSupportsTargetSize, outputUsesQuality } from "@/lib/utils/formats";
import { searchQuality } from "@/lib/utils/target-size";
import type { ConverterSettings, OutputFormat } from "@/types";

export interface EncodedImage {
  bytes: Uint8Array;
  mime: string;
  extension: string;
  withinTarget: boolean;
}

async function canvasEncode(canvas: OffscreenCanvas, format: OutputFormat, quality: number): Promise<Uint8Array> {
  const blob = await canvas.convertToBlob({
    type: OUTPUT_MIME[format],
    quality: quality / 100,
  });
  return new Uint8Array(await blob.arrayBuffer());
}

async function encodeJpeg(image: ImageData, quality: number): Promise<Uint8Array> {
  const { encode } = await loadCodec<CodecEncodeModule>("jpeg/index.js");
  return trimEncoded(asBytes(await encode(cloneImageData(image), { quality })), "jpg");
}

async function encodeWebp(image: ImageData, quality: number): Promise<Uint8Array> {
  const { encode } = await loadCodec<CodecEncodeModule>("webp/index.js");
  return trimEncoded(asBytes(await encode(cloneImageData(image), { quality })), "webp");
}

async function encodeAvif(image: ImageData, quality: number): Promise<Uint8Array> {
  const { encode } = await loadCodec<CodecEncodeModule>("avif/index.js");
  return trimEncoded(asBytes(await encode(cloneImageData(image), { quality, speed: 8 })), "avif");
}

async function encodePngLossless(image: ImageData): Promise<Uint8Array> {
  const { encode } = await loadCodec<CodecEncodeModule>("png/index.js");
  const encoded = asBytes(await encode(cloneImageData(image)));
  return optimisePng(encoded);
}

async function optimisePng(bytes: Uint8Array): Promise<Uint8Array> {
  const png = trimEncoded(bytes, "png");
  try {
    const { optimise } = await loadCodec<OxipngModule>("oxipng/index.js");
    const copy = new Uint8Array(png.byteLength);
    copy.set(png);
    const optimised = await optimise(copy.buffer, {
      level: 2,
      interlace: false,
      optimiseAlpha: true,
    });
    return trimEncoded(asBytes(optimised), "png");
  } catch {
    return png;
  }
}

async function encodePngQuantized(image: ImageData, colors: number): Promise<Uint8Array> {
  const indexed = await quantizeRgba(image, colors, imageHasAlpha(image));
  const png = encodeIndexedPng(image.width, image.height, indexed);
  return optimisePng(png);
}

async function encodeLossy(
  format: OutputFormat,
  image: ImageData,
  canvas: OffscreenCanvas,
  quality: number,
): Promise<Uint8Array> {
  try {
    if (format === "jpg") return await encodeJpeg(image, quality);
    if (format === "webp") return await encodeWebp(image, quality);
    if (format === "avif") return await encodeAvif(image, quality);
  } catch {
    return canvasEncode(canvas, format, quality);
  }
  return canvasEncode(canvas, format, quality);
}

export async function encodeImage(
  image: ImageData,
  canvas: OffscreenCanvas,
  settings: ConverterSettings,
  onProgress?: (progress: number) => void,
): Promise<EncodedImage> {
  const format = settings.outputFormat;
  const mime = OUTPUT_MIME[format];
  const extension = OUTPUT_EXTENSION[format];
  const targetBytes = Math.max(1, Math.round(settings.targetSizeKB * 1024));
  const useTarget = settings.targetSizeEnabled && outputSupportsTargetSize(format);

  if (format === "bmp") {
    const bytes = encodeBmp(image);
    return { bytes, mime, extension, withinTarget: !useTarget || bytes.byteLength <= targetBytes };
  }

  if (format === "gif") {
    if (!useTarget) {
      const bytes = await encodeGif(image, settings.pngColors);
      return { bytes, mime, extension, withinTarget: true };
    }
    const cache = new Map<number, Uint8Array>();
    const found = await searchQuality({
      minQuality: 2,
      maxQuality: Math.min(256, Math.max(2, settings.pngColors)),
      targetBytes,
      encodeAtQuality: async (colors) => {
        const encoded = await encodeGif(image, colors);
        cache.set(colors, encoded);
        return encoded.byteLength;
      },
    });
    onProgress?.(90);
    return {
      bytes: cache.get(found.quality) ?? (await encodeGif(image, found.quality)),
      mime,
      extension,
      withinTarget: !found.exceeded,
    };
  }

  if (format === "png" || format === "ico") {
    const quantized = format === "png" && (settings.pngQuantize || useTarget);
    let bytes: Uint8Array;
    let withinTarget = true;
    if (quantized && useTarget) {
      const cache = new Map<number, Uint8Array>();
      const found = await searchQuality({
        minQuality: 2,
        maxQuality: 256,
        targetBytes,
        encodeAtQuality: async (colors) => {
          const encoded = await encodePngQuantized(image, colors);
          cache.set(colors, encoded);
          return encoded.byteLength;
        },
      });
      bytes = cache.get(found.quality) ?? (await encodePngQuantized(image, found.quality));
      withinTarget = !found.exceeded;
    } else if (quantized) {
      bytes = await encodePngQuantized(image, settings.pngColors);
    } else {
      try {
        bytes = await encodePngLossless(image);
      } catch {
        bytes = await canvasEncode(canvas, "png", 100);
      }
    }
    if (format === "ico") {
      bytes = encodeIco(bytes, image.width, image.height);
      withinTarget = !useTarget || bytes.byteLength <= targetBytes;
    }
    return { bytes, mime, extension, withinTarget };
  }

  if (!outputUsesQuality(format)) {
    const bytes = await canvasEncode(canvas, format, settings.quality);
    return { bytes, mime, extension, withinTarget: !useTarget || bytes.byteLength <= targetBytes };
  }

  if (!useTarget) {
    const bytes = await encodeLossy(format, image, canvas, settings.quality);
    return { bytes, mime, extension, withinTarget: true };
  }

  let probes = 0;
  const cache = new Map<number, Uint8Array>();
  const found = await searchQuality({
    minQuality: 1,
    maxQuality: settings.quality,
    targetBytes,
    encodeAtQuality: async (quality) => {
      probes += 1;
      onProgress?.(Math.min(92, 45 + probes * 6));
      const encoded = await encodeLossy(format, image, canvas, quality);
      cache.set(quality, encoded);
      return encoded.byteLength;
    },
  });
  return {
    bytes: cache.get(found.quality) ?? (await encodeLossy(format, image, canvas, found.quality)),
    mime,
    extension,
    withinTarget: !found.exceeded,
  };
}
