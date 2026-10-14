import { detectFormat } from "@/lib/codecs/detect";
import { prepareSvg } from "@/lib/codecs/dimensions";
import { extractIcoImage } from "@/lib/codecs/ico";
import { toImageData } from "@/lib/codecs/image-data";
import { formatFromMime } from "@/lib/utils/formats";
import type { InputFormat } from "@/types";

const MIME: Record<InputFormat, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  bmp: "image/bmp",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  heic: "image/heic",
};

async function bitmapFromBlob(bytes: Uint8Array, type: string): Promise<ImageBitmap> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const blob = new Blob([copy], { type });
  return createImageBitmap(blob, { imageOrientation: "from-image" });
}

async function bitmapFromRgba(data: Uint8Array | Uint8ClampedArray, width: number, height: number): Promise<ImageBitmap> {
  return createImageBitmap(toImageData(data, width, height));
}

interface HeicDecoded {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

interface HeicDecoder {
  (options: { buffer: Uint8Array }): Promise<HeicDecoded>;
}

async function decodeHeic(bytes: Uint8Array): Promise<ImageBitmap> {
  const loaded = await import("heic-decode");
  const decode = (loaded.default ?? loaded) as HeicDecoder;
  const image = await decode({ buffer: bytes });
  return bitmapFromRgba(image.data, image.width, image.height);
}

interface TiffIfd {
  width: number;
  height: number;
}

interface TiffModule {
  decode: (buffer: ArrayBuffer) => TiffIfd[];
  decodeImage: (buffer: ArrayBuffer, ifd: TiffIfd) => void;
  toRGBA8: (ifd: TiffIfd) => Uint8Array;
}

async function decodeTiff(bytes: Uint8Array): Promise<ImageBitmap> {
  const loaded = (await import("utif")) as { default?: TiffModule } & TiffModule;
  const utif = loaded.default ?? loaded;
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const pages = utif.decode(buffer);
  const page = pages[0];
  if (!page) throw new Error("TIFF file does not contain an image");
  utif.decodeImage(buffer, page);
  const rgba = utif.toRGBA8(page);
  if (!page.width || !page.height) throw new Error("Could not read TIFF dimensions");
  return bitmapFromRgba(rgba, page.width, page.height);
}

export async function decodeToBitmap(bytes: Uint8Array, name: string, mime: string): Promise<ImageBitmap> {
  const format = detectFormat(bytes, name, mime) ?? formatFromMime(mime);
  if (!format) throw new Error("Unsupported image format");

  if (format === "svg") {
    const prepared = prepareSvg(new TextDecoder().decode(bytes));
    return bitmapFromBlob(new TextEncoder().encode(prepared.svg), "image/svg+xml");
  }

  if (format === "heic") {
    try {
      return await bitmapFromBlob(bytes, "image/heic");
    } catch {
      return decodeHeic(bytes);
    }
  }

  if (format === "tiff") {
    try {
      return await bitmapFromBlob(bytes, "image/tiff");
    } catch {
      return decodeTiff(bytes);
    }
  }

  if (format === "ico") {
    try {
      return await bitmapFromBlob(bytes, "image/x-icon");
    } catch {
      const extracted = extractIcoImage(bytes);
      if (!extracted) throw new Error("Could not read this ICO file");
      const type = extracted[0] === 0x89 ? "image/png" : "image/bmp";
      return bitmapFromBlob(extracted, type);
    }
  }

  try {
    return await bitmapFromBlob(bytes, MIME[format]);
  } catch (error) {
    if (format === "avif") {
      const decoded = await decodeWithJsquash(bytes, "avif");
      if (decoded) return decoded;
    }
    if (format === "webp") {
      const decoded = await decodeWithJsquash(bytes, "webp");
      if (decoded) return decoded;
    }
    throw error instanceof Error ? error : new Error("Could not decode this image");
  }
}

function copyBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function decodeWithJsquash(bytes: Uint8Array, format: "avif" | "webp"): Promise<ImageBitmap | null> {
  try {
    const buffer = copyBuffer(bytes);
    if (format === "avif") {
      const { decode } = await import("@jsquash/avif");
      const image = await decode(buffer);
      if (!image) return null;
      return bitmapFromRgba(image.data, image.width, image.height);
    }
    const { decode } = await import("@jsquash/webp");
    const image = await decode(buffer);
    return bitmapFromRgba(image.data, image.width, image.height);
  } catch {
    return null;
  }
}
