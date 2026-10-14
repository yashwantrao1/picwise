import { describe, expect, it } from "vitest";
import { allocateFilename } from "@/lib/utils/filename";

describe("allocateFilename", () => {
  it("replaces the extension and applies a prefix and suffix", () => {
    const used = new Set<string>();
    expect(allocateFilename("my.photo.JPEG", "jpg", "web-", "-min", used)).toBe("web-my.photo-min.jpg");
  });

  it("keeps a name that has no extension", () => {
    const used = new Set<string>();
    expect(allocateFilename("scan", "webp", "", "-compressed", used)).toBe("scan-compressed.webp");
  });

  it("strips folders and illegal filename characters", () => {
    const used = new Set<string>();
    expect(allocateFilename("folder\\b:c?.png", "png", "", "", used)).toBe("bc.png");
  });

  it("de-duplicates collisions without caring about case", () => {
    const used = new Set<string>();
    expect(allocateFilename("Photo.JPG", "webp", "", "-compressed", used)).toBe("Photo-compressed.webp");
    expect(allocateFilename("photo.jpeg", "webp", "", "-compressed", used)).toBe("photo-compressed-2.webp");
    expect(allocateFilename("PHOTO.png", "webp", "", "-compressed", used)).toBe("PHOTO-compressed-3.webp");
  });

  it("falls back when the name is empty", () => {
    const used = new Set<string>();
    expect(allocateFilename("???", "gif", "", "", used)).toBe("image.gif");
  });
});
