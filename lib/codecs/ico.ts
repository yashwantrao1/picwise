function u16(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8);
}

function u32(bytes: Uint8Array, offset: number): number {
  return (
    (bytes[offset] ?? 0) |
    ((bytes[offset + 1] ?? 0) << 8) |
    ((bytes[offset + 2] ?? 0) << 16) |
    ((bytes[offset + 3] ?? 0) << 24)
  );
}

export function encodeIco(png: Uint8Array, width: number, height: number): Uint8Array {
  const out = new Uint8Array(22 + png.length);
  const view = new DataView(out.buffer);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);
  out[6] = width >= 256 ? 0 : width;
  out[7] = height >= 256 ? 0 : height;
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, png.length, true);
  view.setUint32(18, 22, true);
  out.set(png, 22);
  return out;
}

export function extractIcoImage(bytes: Uint8Array): Uint8Array | null {
  if (bytes.length < 22 || bytes[2] !== 1) return null;
  const count = u16(bytes, 4);
  let bestOffset = 0;
  let bestSize = 0;
  let bestArea = 0;
  for (let index = 0; index < count; index += 1) {
    const entry = 6 + index * 16;
    if (entry + 16 > bytes.length) break;
    const width = bytes[entry] === 0 ? 256 : bytes[entry]!;
    const height = bytes[entry + 1] === 0 ? 256 : bytes[entry + 1]!;
    const size = u32(bytes, entry + 8);
    const offset = u32(bytes, entry + 12);
    const area = width * height;
    if (offset > 0 && size > 0 && offset + size <= bytes.length && area >= bestArea) {
      bestArea = area;
      bestOffset = offset;
      bestSize = size;
    }
  }
  if (bestSize <= 0) return null;
  const image = bytes.subarray(bestOffset, bestOffset + bestSize);
  if (image.length >= 8 && image[0] === 0x89 && image[1] === 0x50) return image.slice();
  return dibToBmp(image);
}

function dibToBmp(dib: Uint8Array): Uint8Array | null {
  if (dib.length < 40) return null;
  const headerSize = u32(dib, 0);
  if (headerSize < 40) return null;
  const width = u32(dib, 4);
  const rawHeight = u32(dib, 8) | 0;
  const height = Math.abs(rawHeight);
  const bitCount = u16(dib, 14);
  if (width <= 0 || height <= 0 || (bitCount !== 32 && bitCount !== 24)) return null;
  const xorHeight = rawHeight > height ? Math.floor(rawHeight / 2) : height;
  const rowStride = Math.floor((bitCount * width + 31) / 32) * 4;
  const pixels = headerSize + rowStride * xorHeight;
  if (pixels > dib.length) return null;
  const fileSize = 14 + pixels;
  const out = new Uint8Array(14 + pixels);
  const view = new DataView(out.buffer);
  out[0] = 0x42;
  out[1] = 0x4d;
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 14, true);
  out.set(dib.subarray(0, pixels), 14);
  const dibView = new DataView(out.buffer, 14);
  dibView.setInt32(8, xorHeight, true);
  return out;
}
