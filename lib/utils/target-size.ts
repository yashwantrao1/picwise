export interface QualitySearchOptions {
  minQuality: number;
  maxQuality: number;
  targetBytes: number;
  encodeAtQuality: (quality: number) => Promise<number>;
}

export interface QualitySearchResult {
  quality: number;
  size: number;
  exceeded: boolean;
}

function clampQuality(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(1, Math.round(value));
}

/**
 * Binary-searches a monotonic quality scale for the highest setting whose
 * encoded size does not exceed `targetBytes`. If even the minimum exceeds
 * the target, the smallest sample is returned with `exceeded: true`.
 */
export async function searchQuality(options: QualitySearchOptions): Promise<QualitySearchResult> {
  const min = clampQuality(options.minQuality, 1);
  const max = Math.max(min, clampQuality(options.maxQuality, 100));
  let low = min;
  let high = max;
  let best: QualitySearchResult | null = null;
  let smallest: QualitySearchResult | null = null;
  let guard = 0;

  while (low <= high && guard < 12) {
    guard += 1;
    const quality = Math.floor((low + high) / 2);
    const size = await options.encodeAtQuality(quality);
    if (!smallest || size < smallest.size) {
      smallest = { quality, size, exceeded: true };
    }
    if (size <= options.targetBytes) {
      best = { quality, size, exceeded: false };
      low = quality + 1;
    } else {
      high = quality - 1;
    }
  }

  if (best) return best;
  if (smallest) return smallest;
  const size = await options.encodeAtQuality(min);
  return { quality: min, size, exceeded: size > options.targetBytes };
}
