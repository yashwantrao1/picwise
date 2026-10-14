export interface OrientedSize {
  width: number;
  height: number;
  orientation: number;
}

function u16(bytes: Uint8Array, offset: number, little: boolean): number {
  if (offset + 1 >= bytes.length) return 0;
  const a = bytes[offset] ?? 0;
  const b = bytes[offset + 1] ?? 0;
  return little ? a | (b << 8) : (a << 8) | b;
}

function u32(bytes: Uint8Array, offset: number, little: boolean): number {
  if (offset + 3 >= bytes.length) return 0;
  const a = bytes[offset] ?? 0;
  const b = bytes[offset + 1] ?? 0;
  const c = bytes[offset + 2] ?? 0;
  const d = bytes[offset + 3] ?? 0;
  return little ? a | (b << 8) | (c << 16) | (d << 24) : (a << 24) | (b << 16) | (c << 8) | d;
}

function applyOrientation(width: number, height: number, orientation: number): OrientedSize {
  const swap = orientation >= 5 && orientation <= 8;
  return {
    width: swap ? height : width,
    height: swap ? width : height,
    orientation,
  };
}

export function readExifOrientation(payload: Uint8Array): number | null {
  if (payload.length < 16) return null;
  const marker = String.fromCharCode(payload[0] ?? 0, payload[1] ?? 0, payload[2] ?? 0, payload[3] ?? 0);
  if (marker !== "Exif") return null;
  const tiff = 6;
  const byteOrder = String.fromCharCode(payload[tiff] ?? 0, payload[tiff + 1] ?? 0);
  const little = byteOrder === "II";
  if (!little && byteOrder !== "MM") return null;
  if (u16(payload, tiff + 2, little) !== 42) return null;
  const ifdOffset = tiff + u32(payload, tiff + 4, little);
  const count = u16(payload, ifdOffset, little);
  for (let index = 0; index < count; index += 1) {
    const entry = ifdOffset + 2 + index * 12;
    if (u16(payload, entry, little) !== 0x0112) continue;
    return u16(payload, entry + 8, little) || 1;
  }
  return null;
}

export function withOrientation(segment: Uint8Array, orientation = 1): Uint8Array {
  const copy = new Uint8Array(segment);
  const current = readExifOrientation(copy);
  if (current === null) return copy;
  const marker = String.fromCharCode(copy[0] ?? 0, copy[1] ?? 0, copy[2] ?? 0, copy[3] ?? 0);
  if (marker !== "Exif") return copy;
  const tiff = 6;
  const byteOrder = String.fromCharCode(copy[tiff] ?? 0, copy[tiff + 1] ?? 0);
  const little = byteOrder === "II";
  const ifdOffset = tiff + u32(copy, tiff + 4, little);
  const count = u16(copy, ifdOffset, little);
  for (let index = 0; index < count; index += 1) {
    const entry = ifdOffset + 2 + index * 12;
    if (u16(copy, entry, little) !== 0x0112) continue;
    if (little) {
      copy[entry + 8] = orientation & 0xff;
      copy[entry + 9] = (orientation >> 8) & 0xff;
    } else {
      copy[entry + 8] = (orientation >> 8) & 0xff;
      copy[entry + 9] = orientation & 0xff;
    }
    break;
  }
  return copy;
}

function jpegSegments(bytes: Uint8Array): { size: OrientedSize | null; exif: Uint8Array | null } {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return { size: null, exif: null };
  let offset = 2;
  let orientation = 1;
  let exif: Uint8Array | null = null;
  let size: { width: number; height: number } | null = null;
  while (offset + 3 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1] ?? 0;
    if (marker === 0xd8) {
      offset += 2;
      continue;
    }
    if (marker === 0xd9 || marker === 0xda) break;
    const length = u16(bytes, offset + 2, false);
    if (length < 2 || offset + 2 + length > bytes.length) break;
    if (marker === 0xe1 && !exif) {
      const payload = bytes.subarray(offset + 4, offset + 2 + length);
      const found = readExifOrientation(payload);
      if (found) {
        orientation = found;
        exif = payload.slice();
      }
    }
    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isSof && offset + 9 < bytes.length) {
      size = {
        height: u16(bytes, offset + 5, false),
        width: u16(bytes, offset + 7, false),
      };
    }
    offset += 2 + length;
  }
  return {
    size: size && size.width > 0 && size.height > 0 ? applyOrientation(size.width, size.height, orientation) : null,
    exif,
  };
}

export function readJpegMetadata(bytes: Uint8Array): { size: OrientedSize | null; exif: Uint8Array | null } {
  return jpegSegments(bytes);
}

export function transplantJpegExif(original: Uint8Array, encoded: Uint8Array): Uint8Array {
  const { exif } = jpegSegments(original);
  if (!exif || encoded.length < 2 || encoded[0] !== 0xff || encoded[1] !== 0xd8) return encoded;
  const normalized = withOrientation(exif, 1);
  const segment = new Uint8Array(normalized.length + 4);
  segment[0] = 0xff;
  segment[1] = 0xe1;
  segment[2] = ((normalized.length + 2) >> 8) & 0xff;
  segment[3] = (normalized.length + 2) & 0xff;
  segment.set(normalized, 4);
  const out = new Uint8Array(encoded.length + segment.length);
  out[0] = 0xff;
  out[1] = 0xd8;
  out.set(segment, 2);
  out.set(encoded.subarray(2), 2 + segment.length);
  return out;
}

function readPngSize(bytes: Uint8Array): OrientedSize | null {
  if (bytes.length < 24) return null;
  const width = u32(bytes, 16, false);
  const height = u32(bytes, 20, false);
  if (width <= 0 || height <= 0) return null;
  return { width, height, orientation: 1 };
}

function readGifSize(bytes: Uint8Array): OrientedSize | null {
  if (bytes.length < 10) return null;
  const width = u16(bytes, 6, true);
  const height = u16(bytes, 8, true);
  if (width <= 0 || height <= 0) return null;
  return { width, height, orientation: 1 };
}

function readBmpSize(bytes: Uint8Array): OrientedSize | null {
  if (bytes.length < 26) return null;
  const width = u32(bytes, 18, true);
  const height = Math.abs(u32(bytes, 22, true) | 0);
  if (width <= 0 || height <= 0) return null;
  return { width, height, orientation: 1 };
}

function readWebpSize(bytes: Uint8Array): OrientedSize | null {
  if (bytes.length < 30) return null;
  const chunk = String.fromCharCode(bytes[12] ?? 0, bytes[13] ?? 0, bytes[14] ?? 0, bytes[15] ?? 0);
  if (chunk === "VP8X" && bytes.length >= 30) {
    const width = 1 + (bytes[24]! | (bytes[25]! << 8) | (bytes[26]! << 16));
    const height = 1 + (bytes[27]! | (bytes[28]! << 8) | (bytes[29]! << 16));
    return { width, height, orientation: 1 };
  }
  if (chunk === "VP8L" && bytes.length >= 25) {
    const bits = u32(bytes, 21, true);
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    return { width, height, orientation: 1 };
  }
  if (chunk === "VP8 " && bytes.length >= 30) {
    const width = u16(bytes, 26, true) & 0x3fff;
    const height = u16(bytes, 28, true) & 0x3fff;
    if (width > 0 && height > 0) return { width, height, orientation: 1 };
  }
  return null;
}

function readTiffSize(bytes: Uint8Array): OrientedSize | null {
  if (bytes.length < 8) return null;
  const little = bytes[0] === 0x49;
  if (u16(bytes, 2, little) !== 42) return null;
  const ifd = u32(bytes, 4, little);
  const count = u16(bytes, ifd, little);
  let width = 0;
  let height = 0;
  let orientation = 1;
  for (let index = 0; index < count; index += 1) {
    const entry = ifd + 2 + index * 12;
    const tag = u16(bytes, entry, little);
    const type = u16(bytes, entry + 2, little);
    const value = type === 3 ? u16(bytes, entry + 8, little) : u32(bytes, entry + 8, little);
    if (tag === 256) width = value;
    if (tag === 257) height = value;
    if (tag === 274) orientation = value || 1;
  }
  if (width <= 0 || height <= 0) return null;
  return applyOrientation(width, height, orientation);
}

function readIcoSize(bytes: Uint8Array): OrientedSize | null {
  if (bytes.length < 16) return null;
  const count = u16(bytes, 4, true);
  let best = 0;
  let width = 0;
  let height = 0;
  for (let index = 0; index < count && 6 + (index + 1) * 16 <= bytes.length; index += 1) {
    const entry = 6 + index * 16;
    const entryWidth = bytes[entry] === 0 ? 256 : bytes[entry]!;
    const entryHeight = bytes[entry + 1] === 0 ? 256 : bytes[entry + 1]!;
    const area = entryWidth * entryHeight;
    if (area > best) {
      best = area;
      width = entryWidth;
      height = entryHeight;
    }
  }
  if (width <= 0 || height <= 0) return null;
  return { width, height, orientation: 1 };
}

function readIspeSize(bytes: Uint8Array): OrientedSize | null {
  const token = [0x69, 0x73, 0x70, 0x65];
  for (let index = 0; index < bytes.length - 16; index += 1) {
    if (token.every((value, offset) => bytes[index + offset] === value)) {
      const width = u32(bytes, index + 8, false);
      const height = u32(bytes, index + 12, false);
      if (width > 0 && height > 0 && width < 100000 && height < 100000) {
        return { width, height, orientation: 1 };
      }
    }
  }
  return null;
}

export function readSvgSize(text: string): OrientedSize | null {
  const viewBox = text.match(/viewBox\s*=\s*["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i);
  const widthAttr = text.match(/\bwidth\s*=\s*["']\s*([\d.]+)\s*(px)?\s*["']/i);
  const heightAttr = text.match(/\bheight\s*=\s*["']\s*([\d.]+)\s*(px)?\s*["']/i);
  const width = widthAttr ? Number(widthAttr[1]) : 0;
  const height = heightAttr ? Number(heightAttr[1]) : 0;
  if (width > 0 && height > 0) return { width: Math.round(width), height: Math.round(height), orientation: 1 };
  if (viewBox) {
    const boxWidth = Number(viewBox[3]);
    const boxHeight = Number(viewBox[4]);
    if (boxWidth > 0 && boxHeight > 0) {
      return { width: Math.round(boxWidth), height: Math.round(boxHeight), orientation: 1 };
    }
  }
  if (width > 0) return { width: Math.round(width), height: Math.round(width), orientation: 1 };
  if (height > 0) return { width: Math.round(height), height: Math.round(height), orientation: 1 };
  return null;
}

export function prepareSvg(text: string): { svg: string; width: number; height: number } {
  const size = readSvgSize(text) ?? { width: 1024, height: 1024, orientation: 1 };
  let svg = text.trim();
  const start = svg.search(/<svg\b/i);
  if (start > 0) svg = svg.slice(start);
  if (!readSvgSize(text)) {
    svg = svg.replace(/<svg\b([^>]*)>/i, (_match, attrs: string) => {
      const withoutSize = attrs
        .replace(/\swidth\s*=\s*["'][^"']*["']/i, "")
        .replace(/\sheight\s*=\s*["'][^"']*["']/i, "");
      return `<svg${withoutSize} width="${size.width}" height="${size.height}">`;
    });
  }
  return { svg, width: size.width, height: size.height };
}

export function readImageSize(bytes: Uint8Array, format: string | null): OrientedSize | null {
  switch (format) {
    case "png":
      return readPngSize(bytes);
    case "jpg":
      return readJpegMetadata(bytes).size;
    case "gif":
      return readGifSize(bytes);
    case "bmp":
      return readBmpSize(bytes);
    case "webp":
      return readWebpSize(bytes);
    case "tiff":
      return readTiffSize(bytes);
    case "ico":
      return readIcoSize(bytes);
    case "avif":
    case "heic":
      return readIspeSize(bytes);
    case "svg":
      return readSvgSize(new TextDecoder().decode(bytes));
    default:
      return null;
  }
}
