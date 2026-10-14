export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  const units = ["KB", "MB", "GB", "TB"] as const;
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const digits = value >= 10 ? 1 : 2;
  return `${value.toFixed(digits)} ${units[unitIndex]}`;
}

export function savedRatio(original: number, next: number): number {
  if (!Number.isFinite(original) || original <= 0 || !Number.isFinite(next)) return 0;
  return (original - next) / original;
}

export interface SavingsLabel {
  label: string;
  tone: "positive" | "negative" | "neutral";
}

export function formatSavings(original: number, next: number): SavingsLabel {
  const ratio = savedRatio(original, next);
  const percent = Math.abs(ratio * 100);
  if (percent < 0.05) return { label: "No size change", tone: "neutral" };
  const digits = percent >= 10 ? 0 : 1;
  const rounded = percent.toFixed(digits);
  if (ratio > 0) return { label: `${rounded}% smaller`, tone: "positive" };
  return { label: `${rounded}% larger`, tone: "negative" };
}
