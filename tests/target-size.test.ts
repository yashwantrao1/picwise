import { describe, expect, it } from "vitest";
import { searchQuality } from "@/lib/utils/target-size";

describe("searchQuality", () => {
  it("picks the highest quality that stays within the target", async () => {
    const result = await searchQuality({
      minQuality: 1,
      maxQuality: 10,
      targetBytes: 5000,
      encodeAtQuality: async (quality) => quality * 1000,
    });
    expect(result).toEqual({ quality: 5, size: 5000, exceeded: false });
  });

  it("returns the minimum quality when every sample is too large", async () => {
    const result = await searchQuality({
      minQuality: 1,
      maxQuality: 8,
      targetBytes: 1000,
      encodeAtQuality: async (quality) => 10000 + quality,
    });
    expect(result.exceeded).toBe(true);
    expect(result.quality).toBe(1);
    expect(result.size).toBe(10001);
  });

  it("returns the maximum quality when every sample fits", async () => {
    const result = await searchQuality({
      minQuality: 1,
      maxQuality: 10,
      targetBytes: 500,
      encodeAtQuality: async () => 100,
    });
    expect(result).toEqual({ quality: 10, size: 100, exceeded: false });
  });

  it("can search a palette range above 100", async () => {
    const result = await searchQuality({
      minQuality: 2,
      maxQuality: 256,
      targetBytes: 80,
      encodeAtQuality: async (colors) => colors,
    });
    expect(result).toEqual({ quality: 80, size: 80, exceeded: false });
  });
});
