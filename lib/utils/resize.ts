import type { DrawRect, FitMode, ResizeInput } from "@/types";

function positiveInt(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.max(1, Math.round(value));
}

function identity(srcWidth: number, srcHeight: number): DrawRect {
  const sw = positiveInt(srcWidth, 1);
  const sh = positiveInt(srcHeight, 1);
  return {
    canvasWidth: sw,
    canvasHeight: sh,
    sx: 0,
    sy: 0,
    sw,
    sh,
    dx: 0,
    dy: 0,
    dw: sw,
    dh: sh,
  };
}

function contain(sw: number, sh: number, boxW: number, boxH: number, allowUpscale: boolean): DrawRect {
  let scale = Math.min(boxW / sw, boxH / sh);
  if (!Number.isFinite(scale) || scale <= 0) scale = 1;
  if (!allowUpscale) scale = Math.min(scale, 1);
  const dw = positiveInt(sw * scale, 1);
  const dh = positiveInt(sh * scale, 1);
  return {
    canvasWidth: dw,
    canvasHeight: dh,
    sx: 0,
    sy: 0,
    sw,
    sh,
    dx: 0,
    dy: 0,
    dw,
    dh,
  };
}

function cover(sw: number, sh: number, boxW: number, boxH: number, allowUpscale: boolean): DrawRect {
  let scale = Math.max(boxW / sw, boxH / sh);
  if (!Number.isFinite(scale) || scale <= 0) scale = 1;
  if (!allowUpscale && scale > 1) return identity(sw, sh);
  const canvasWidth = positiveInt(boxW, 1);
  const canvasHeight = positiveInt(boxH, 1);
  const cropW = Math.min(sw, canvasWidth / scale);
  const cropH = Math.min(sh, canvasHeight / scale);
  return {
    canvasWidth,
    canvasHeight,
    sx: Math.max(0, (sw - cropW) / 2),
    sy: Math.max(0, (sh - cropH) / 2),
    sw: cropW,
    sh: cropH,
    dx: 0,
    dy: 0,
    dw: canvasWidth,
    dh: canvasHeight,
  };
}

function exact(sw: number, sh: number, boxW: number, boxH: number, allowUpscale: boolean): DrawRect {
  let dw = positiveInt(boxW, sw);
  let dh = positiveInt(boxH, sh);
  if (!allowUpscale) {
    dw = Math.min(dw, sw);
    dh = Math.min(dh, sh);
  }
  return {
    canvasWidth: dw,
    canvasHeight: dh,
    sx: 0,
    sy: 0,
    sw,
    sh,
    dx: 0,
    dy: 0,
    dw,
    dh,
  };
}

function resolveBox(
  sw: number,
  sh: number,
  width: number,
  height: number,
  lockAspect: boolean,
  fit: FitMode,
): { boxW: number; boxH: number; fit: FitMode } | null {
  let boxW = width > 0 ? width : 0;
  let boxH = height > 0 ? height : 0;
  if (lockAspect) {
    if (boxW > 0 && boxH <= 0) boxH = boxW * (sh / sw);
    else if (boxH > 0 && boxW <= 0) boxW = boxH * (sw / sh);
  }
  if (boxW <= 0 && boxH <= 0) return null;
  if (boxW <= 0 || boxH <= 0) {
    if (boxW <= 0) boxW = boxH * (sw / sh);
    if (boxH <= 0) boxH = boxW * (sh / sw);
    return { boxW, boxH, fit: "contain" };
  }
  return { boxW, boxH, fit };
}

export function planResize(input: ResizeInput): DrawRect {
  const sw = positiveInt(input.srcWidth, 1);
  const sh = positiveInt(input.srcHeight, 1);
  if (input.mode === "none") return identity(sw, sh);

  if (input.mode === "percentage") {
    let scale = input.percentage / 100;
    if (!Number.isFinite(scale) || scale <= 0) scale = 1;
    if (!input.allowUpscale) scale = Math.min(scale, 1);
    const dw = positiveInt(sw * scale, 1);
    const dh = positiveInt(sh * scale, 1);
    return {
      canvasWidth: dw,
      canvasHeight: dh,
      sx: 0,
      sy: 0,
      sw,
      sh,
      dx: 0,
      dy: 0,
      dw,
      dh,
    };
  }

  const box = resolveBox(sw, sh, input.width, input.height, input.lockAspect, input.fit);
  if (!box) return identity(sw, sh);
  if (box.fit === "cover") return cover(sw, sh, box.boxW, box.boxH, input.allowUpscale);
  if (box.fit === "exact" && !input.lockAspect) {
    return exact(sw, sh, box.boxW, box.boxH, input.allowUpscale);
  }
  return contain(sw, sh, box.boxW, box.boxH, input.allowUpscale);
}

export function limitLongestEdge(plan: DrawRect, maxEdge: number): DrawRect {
  if (!Number.isFinite(maxEdge) || maxEdge <= 0) return plan;
  const longest = Math.max(plan.canvasWidth, plan.canvasHeight);
  if (longest <= maxEdge) return plan;
  const scale = maxEdge / longest;
  const canvasWidth = Math.max(1, Math.round(plan.canvasWidth * scale));
  const canvasHeight = Math.max(1, Math.round(plan.canvasHeight * scale));
  return {
    ...plan,
    canvasWidth,
    canvasHeight,
    dx: 0,
    dy: 0,
    dw: canvasWidth,
    dh: canvasHeight,
  };
}
