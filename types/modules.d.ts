declare module "gifenc" {
  export function quantize(
    data: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    options?: { format?: "rgb565" | "rgb444" | "rgba4444" },
  ): number[][];
  export function applyPalette(
    data: Uint8Array | Uint8ClampedArray,
    palette: number[][],
    format?: "rgb565" | "rgb444" | "rgba4444",
  ): Uint8Array;
  export function GIFEncoder(): {
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

declare module "heic-decode" {
  interface HeicImage {
    width: number;
    height: number;
    data: Uint8ClampedArray;
  }
  function decode(options: { buffer: Uint8Array }): Promise<HeicImage>;
  export default decode;
}

declare module "utif" {
  interface TiffIfd {
    width: number;
    height: number;
  }
  interface TiffApi {
    decode: (buffer: ArrayBuffer) => TiffIfd[];
    decodeImage: (buffer: ArrayBuffer, ifd: TiffIfd) => void;
    toRGBA8: (ifd: TiffIfd) => Uint8Array;
  }
  const UTIF: TiffApi;
  export default UTIF;
}
