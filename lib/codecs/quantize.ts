import type { IndexedPixels } from "@/lib/codecs/png-indexed";

interface GifencModule {
  quantize: (
    data: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    options?: { format?: "rgb565" | "rgb444" | "rgba4444" },
  ) => number[][];
  applyPalette: (
    data: Uint8Array | Uint8ClampedArray,
    palette: number[][],
    format?: "rgb565" | "rgb444" | "rgba4444",
  ) => Uint8Array;
  GIFEncoder: () => {
    writeFrame: (
      index: Uint8Array,
      width: number,
      height: number,
      options: { palette: number[][]; transparent?: boolean; transparentIndex?: number },
    ) => void;
    finish: () => void;
    bytes: () => Uint8Array;
  };
}

async function loadGifenc(): Promise<GifencModule> {
  const gifenc = await import("gifenc");
  return gifenc as unknown as GifencModule;
}

export async function quantizeRgba(
  image: ImageData,
  colorCount: number,
  keepAlpha: boolean,
): Promise<IndexedPixels> {
  const gifenc = await loadGifenc();
  const colors = Math.min(256, Math.max(2, Math.round(colorCount)));
  const format = keepAlpha ? "rgba4444" : "rgb565";
  const palette = gifenc.quantize(image.data, colors, { format });
  const indices = gifenc.applyPalette(image.data, palette, format);
  return { indices, palette };
}

export async function encodeGif(
  image: ImageData,
  colorCount: number,
): Promise<Uint8Array> {
  const gifenc = await loadGifenc();
  const keepAlpha = image.data.some((value, index) => index % 4 === 3 && value < 250);
  const colors = Math.min(256, Math.max(2, Math.round(colorCount)));
  const format = keepAlpha ? "rgba4444" : "rgb565";
  const palette = gifenc.quantize(image.data, colors, { format });
  const index = gifenc.applyPalette(image.data, palette, format);
  const transparentIndex = keepAlpha
    ? palette.findIndex((color) => (color[3] ?? 255) === 0)
    : -1;
  const gif = gifenc.GIFEncoder();
  gif.writeFrame(index, image.width, image.height, {
    palette,
    transparent: transparentIndex >= 0,
    transparentIndex: transparentIndex >= 0 ? transparentIndex : 0,
  });
  gif.finish();
  return gif.bytes();
}
