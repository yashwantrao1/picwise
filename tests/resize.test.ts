import { describe, expect, it } from "vitest";
import { limitLongestEdge, planResize } from "@/lib/utils/resize";
import type { ResizeInput } from "@/types";

function input(overrides: Partial<ResizeInput> = {}): ResizeInput {
  return {
    srcWidth: 4000,
    srcHeight: 2000,
    mode: "none",
    width: 0,
    height: 0,
    percentage: 100,
    fit: "contain",
    allowUpscale: false,
    lockAspect: true,
    ...overrides,
  };
}

describe("planResize", () => {
  it("keeps the original size when resize is off", () => {
    expect(planResize(input())).toMatchObject({ canvasWidth: 4000, canvasHeight: 2000, dw: 4000, dh: 2000 });
  });

  it("fits within a box without upscaling", () => {
    const plan = planResize(input({ mode: "dimensions", width: 1000, height: 1000, fit: "contain" }));
    expect(plan).toMatchObject({ canvasWidth: 1000, canvasHeight: 500, dw: 1000, dh: 500, sx: 0, sy: 0 });
  });

  it("does not upscale a small image unless allowed", () => {
    const blocked = planResize(
      input({ srcWidth: 100, srcHeight: 100, mode: "dimensions", width: 400, height: 400, fit: "contain" }),
    );
    const allowed = planResize(
      input({
        srcWidth: 100,
        srcHeight: 100,
        mode: "dimensions",
        width: 400,
        height: 400,
        fit: "contain",
        allowUpscale: true,
      }),
    );
    expect(blocked).toMatchObject({ canvasWidth: 100, canvasHeight: 100 });
    expect(allowed).toMatchObject({ canvasWidth: 400, canvasHeight: 400 });
  });

  it("crops from the center when filling a box", () => {
    const plan = planResize(
      input({ srcWidth: 400, srcHeight: 200, mode: "dimensions", width: 100, height: 100, fit: "cover", lockAspect: false }),
    );
    expect(plan.canvasWidth).toBe(100);
    expect(plan.canvasHeight).toBe(100);
    expect(plan.sx).toBeCloseTo(100);
    expect(plan.sy).toBeCloseTo(0);
    expect(plan.sw).toBeCloseTo(200);
    expect(plan.sh).toBeCloseTo(200);
  });

  it("leaves a cover request unchanged when upscaling would be required", () => {
    const plan = planResize(
      input({ srcWidth: 50, srcHeight: 40, mode: "dimensions", width: 100, height: 100, fit: "cover", lockAspect: false }),
    );
    expect(plan).toMatchObject({ canvasWidth: 50, canvasHeight: 40 });
  });

  it("stretches to exact dimensions", () => {
    const plan = planResize(
      input({ mode: "dimensions", width: 100, height: 80, fit: "exact", lockAspect: false, allowUpscale: false }),
    );
    expect(plan).toMatchObject({ canvasWidth: 100, canvasHeight: 80, dw: 100, dh: 80, sw: 4000, sh: 2000 });
  });

  it("derives height from the image when only width is set", () => {
    const landscape = planResize(input({ mode: "dimensions", width: 800, height: 0, lockAspect: true }));
    const portrait = planResize(
      input({ srcWidth: 1000, srcHeight: 2000, mode: "dimensions", width: 500, height: 0, lockAspect: true }),
    );
    expect(landscape).toMatchObject({ canvasWidth: 800, canvasHeight: 400 });
    expect(portrait).toMatchObject({ canvasWidth: 500, canvasHeight: 1000 });
  });

  it("scales by percentage and clamps at the original size", () => {
    expect(planResize(input({ mode: "percentage", percentage: 50 }))).toMatchObject({
      canvasWidth: 2000,
      canvasHeight: 1000,
    });
    expect(planResize(input({ mode: "percentage", percentage: 150, allowUpscale: false }))).toMatchObject({
      canvasWidth: 4000,
      canvasHeight: 2000,
    });
  });
});

describe("limitLongestEdge", () => {
  it("scales the canvas down while keeping the source crop", () => {
    const plan = planResize(input({ mode: "dimensions", width: 1000, height: 500, fit: "contain" }));
    const limited = limitLongestEdge(plan, 256);
    expect(limited.canvasWidth).toBe(256);
    expect(limited.canvasHeight).toBe(128);
    expect(limited.sw).toBe(4000);
    expect(limited.sh).toBe(2000);
  });
});
