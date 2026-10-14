import { INPUT_FORMATS, OUTPUT_FORMATS, type InputFormat, type OutputFormat } from "@/types";

export const OUTPUT_MIME: Record<OutputFormat, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  bmp: "image/bmp",
  ico: "image/x-icon",
  gif: "image/gif",
};

export const OUTPUT_EXTENSION: Record<OutputFormat, string> = {
  png: "png",
  jpg: "jpg",
  webp: "webp",
  avif: "avif",
  bmp: "bmp",
  ico: "ico",
  gif: "gif",
};

export function isInputFormat(value: string | null): value is InputFormat {
  return value !== null && (INPUT_FORMATS as readonly string[]).includes(value);
}

export function isOutputFormat(value: string | null): value is OutputFormat {
  return value !== null && (OUTPUT_FORMATS as readonly string[]).includes(value);
}

export const FORMAT_LABEL: Record<InputFormat | OutputFormat, string> = {
  png: "PNG",
  jpg: "JPG",
  webp: "WebP",
  avif: "AVIF",
  gif: "GIF",
  bmp: "BMP",
  tiff: "TIFF",
  svg: "SVG",
  ico: "ICO",
  heic: "HEIC",
};

const MIME_TO_FORMAT: Record<string, InputFormat> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/pjpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "image/x-ms-bmp": "bmp",
  "image/tiff": "tiff",
  "image/tif": "tiff",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "image/heic": "heic",
  "image/heif": "heic",
  "image/heic-sequence": "heic",
  "image/heif-sequence": "heic",
};

const EXTENSION_TO_FORMAT: Record<string, InputFormat> = {
  png: "png",
  jpg: "jpg",
  jpeg: "jpg",
  jpe: "jpg",
  webp: "webp",
  avif: "avif",
  gif: "gif",
  bmp: "bmp",
  dib: "bmp",
  tif: "tiff",
  tiff: "tiff",
  svg: "svg",
  ico: "ico",
  cur: "ico",
  heic: "heic",
  heif: "heic",
};

export function fileExtension(name: string): string {
  const slash = Math.max(name.lastIndexOf("/"), name.lastIndexOf("\\"));
  const base = slash >= 0 ? name.slice(slash + 1) : name;
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  return base.slice(dot + 1).toLowerCase();
}

export function formatFromMime(mime: string): InputFormat | null {
  return MIME_TO_FORMAT[mime.toLowerCase()] ?? null;
}

export function formatFromName(name: string): InputFormat | null {
  return EXTENSION_TO_FORMAT[fileExtension(name)] ?? null;
}

export function outputSupportsAlpha(format: OutputFormat): boolean {
  return format === "png" || format === "webp" || format === "avif" || format === "gif" || format === "ico";
}

export function outputUsesQuality(format: OutputFormat): boolean {
  return format === "jpg" || format === "webp" || format === "avif";
}

export function outputSupportsTargetSize(format: OutputFormat): boolean {
  return format === "jpg" || format === "webp" || format === "avif" || format === "png" || format === "gif";
}

export function parseHexColor(input: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(input) ? input.toLowerCase() : "#ffffff";
}
