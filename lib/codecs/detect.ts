import { formatFromMime, formatFromName } from "@/lib/utils/formats";
import type { InputFormat } from "@/types";

function ascii(bytes: Uint8Array, start: number, end: number): string {
  let text = "";
  const last = Math.min(end, bytes.length);
  for (let index = start; index < last; index += 1) {
    text += String.fromCharCode(bytes[index] ?? 0);
  }
  return text;
}

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  if (bytes.length < signature.length) return false;
  return signature.every((value, index) => bytes[index] === value);
}

function ftypBrand(bytes: Uint8Array): string {
  if (ascii(bytes, 4, 8) !== "ftyp") return "";
  return ascii(bytes, 8, 12).replace(/\0/g, "").trim().toLowerCase();
}

export function detectFormat(bytes: Uint8Array, name: string, mime: string): InputFormat | null {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "jpg";
  if (ascii(bytes, 0, 6) === "GIF87a" || ascii(bytes, 0, 6) === "GIF89a") return "gif";
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WEBP") return "webp";
  if (startsWith(bytes, [0x42, 0x4d])) return "bmp";
  if (startsWith(bytes, [0x49, 0x49, 0x2a, 0x00]) || startsWith(bytes, [0x4d, 0x4d, 0x00, 0x2a])) return "tiff";
  if (bytes.length >= 6 && bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0) {
    const count = bytes[4]! | (bytes[5]! << 8);
    if (count > 0 && count < 256) return "ico";
  }

  const brand = ftypBrand(bytes);
  if (brand === "avif" || brand === "avis") return "avif";
  if (["heic", "heix", "hevc", "hevx", "heif", "mif1", "msf1"].includes(brand)) return "heic";

  const head = ascii(bytes, 0, Math.min(bytes.length, 256)).trimStart().toLowerCase();
  if (head.startsWith("<svg") || head.includes("<svg") || mime === "image/svg+xml") return "svg";

  return formatFromMime(mime) ?? formatFromName(name);
}
