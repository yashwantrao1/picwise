import type { OutputFormat } from "@/types";

function u32be(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] ?? 0) << 24) |
    ((bytes[offset + 1] ?? 0) << 16) |
    ((bytes[offset + 2] ?? 0) << 8) |
    (bytes[offset + 3] ?? 0)
  ) >>> 0;
}

function u32le(bytes: Uint8Array, offset: number): number {
  return (
    (bytes[offset] ?? 0) |
    ((bytes[offset + 1] ?? 0) << 8) |
    ((bytes[offset + 2] ?? 0) << 16) |
    ((bytes[offset + 3] ?? 0) << 24)
  ) >>> 0;
}

function trimJpeg(bytes: Uint8Array): Uint8Array {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return bytes;
  for (let index = 2; index < bytes.length - 1; index += 1) {
    if (bytes[index] === 0xff && bytes[index + 1] === 0xd9) return bytes.subarray(0, index + 2);
  }
  return bytes;
}

function trimPng(bytes: Uint8Array): Uint8Array {
  if (bytes.length < 8 || bytes[0] !== 0x89) return bytes;
  let offset = 8;
  while (offset + 8 <= bytes.length) {
    const length = u32be(bytes, offset);
    const type = String.fromCharCode(
      bytes[offset + 4] ?? 0,
      bytes[offset + 5] ?? 0,
      bytes[offset + 6] ?? 0,
      bytes[offset + 7] ?? 0,
    );
    const next = offset + 12 + length;
    if (next > bytes.length) break;
    offset = next;
    if (type === "IEND") return bytes.subarray(0, offset);
  }
  return bytes;
}

function trimWebp(bytes: Uint8Array): Uint8Array {
  if (bytes.length < 12) return bytes;
  const riff = String.fromCharCode(bytes[0] ?? 0, bytes[1] ?? 0, bytes[2] ?? 0, bytes[3] ?? 0);
  const webp = String.fromCharCode(bytes[8] ?? 0, bytes[9] ?? 0, bytes[10] ?? 0, bytes[11] ?? 0);
  if (riff !== "RIFF" || webp !== "WEBP") return bytes;
  const size = u32le(bytes, 4);
  const end = Math.min(bytes.length, size + 8);
  return bytes.subarray(0, end);
}

function trimIsoBmff(bytes: Uint8Array): Uint8Array {
  let offset = 0;
  while (offset + 8 <= bytes.length) {
    const size = u32be(bytes, offset);
    if (size < 8 || offset + size > bytes.length) break;
    offset += size;
  }
  return offset > 0 ? bytes.subarray(0, offset) : bytes;
}

export function trimEncoded(bytes: Uint8Array, format: OutputFormat): Uint8Array {
  if (format === "jpg") return trimJpeg(bytes);
  if (format === "png") return trimPng(bytes);
  if (format === "webp") return trimWebp(bytes);
  if (format === "avif") return trimIsoBmff(bytes);
  return bytes;
}
