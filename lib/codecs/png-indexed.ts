import { zlibSync } from "fflate";
import type { ImageDataLike } from "@/lib/codecs/image-data";

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) {
    crc ^= bytes[index] ?? 0;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }
  return ~crc >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  out[4] = type.charCodeAt(0);
  out[5] = type.charCodeAt(1);
  out[6] = type.charCodeAt(2);
  out[7] = type.charCodeAt(3);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const size = parts.reduce((total, part) => total + part.length, 0);
  const out = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

export interface IndexedPixels {
  indices: Uint8Array;
  palette: number[][];
}

export function encodeIndexedPng(width: number, height: number, indexed: IndexedPixels): Uint8Array {
  const palette = indexed.palette.slice(0, 256);
  if (palette.length === 0) throw new Error("PNG palette is empty");
  const ihdr = new Uint8Array(13);
  const view = new DataView(ihdr.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  ihdr[8] = 8;
  ihdr[9] = 3;
  const plte = new Uint8Array(palette.length * 3);
  const trns = new Uint8Array(palette.length);
  let transparent = false;
  palette.forEach((color, index) => {
    plte[index * 3] = color[0] ?? 0;
    plte[index * 3 + 1] = color[1] ?? 0;
    plte[index * 3 + 2] = color[2] ?? 0;
    const alpha = color[3] ?? 255;
    trns[index] = alpha;
    if (alpha < 255) transparent = true;
  });
  const raw = new Uint8Array((width + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const row = y * (width + 1);
    raw[row] = 0;
    raw.set(indexed.indices.subarray(y * width, y * width + width), row + 1);
  }
  const signature = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const parts = [signature, chunk("IHDR", ihdr), chunk("PLTE", plte)];
  if (transparent) parts.push(chunk("tRNS", trns));
  parts.push(chunk("IDAT", zlibSync(raw)), chunk("IEND", new Uint8Array()));
  return concat(parts);
}

export function imageHasAlpha(image: ImageDataLike): boolean {
  for (let index = 3; index < image.data.length; index += 4) {
    if ((image.data[index] ?? 255) < 250) return true;
  }
  return false;
}
