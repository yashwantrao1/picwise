export const LARGE_FILE_BYTES = 50 * 1024 * 1024;
export const MAX_FILE_BYTES = 250 * 1024 * 1024;
export const MAX_BATCH_FILES = 500;
export const BATCH_MEMORY_WARNING_BYTES = 1.5 * 1024 * 1024 * 1024;
export const MAX_PIXELS = 120_000_000;
export const ICO_MAX_EDGE = 256;

export function workerCount(hardwareConcurrency?: number): number {
  const cores = hardwareConcurrency && hardwareConcurrency > 0 ? hardwareConcurrency : 2;
  const requested = Math.max(1, cores - 1);
  return Math.min(requested, 4);
}

export function estimateDecodedBytes(width: number | null, height: number | null, fileSize: number): number {
  if (width && height && width > 0 && height > 0) return width * height * 4;
  return Math.max(fileSize, 1) * 12;
}
