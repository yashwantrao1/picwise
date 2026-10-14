type CodecBytes = ArrayBuffer | Uint8Array;

export interface CodecEncodeModule {
  encode: (image: ImageData, options?: { quality?: number; speed?: number }) => Promise<CodecBytes>;
}

export interface CodecDecodeModule {
  decode: (buffer: ArrayBuffer) => Promise<{ data: Uint8Array | Uint8ClampedArray; width: number; height: number } | null>;
}

export interface OxipngModule {
  optimise: (
    data: ArrayBuffer,
    options: { level: number; interlace: boolean; optimiseAlpha: boolean },
  ) => Promise<CodecBytes>;
}

export async function loadCodec<T extends object>(file: string): Promise<T> {
  const specifier = `/codecs/${file}`;
  const loaded: T = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ specifier);
  return loaded;
}
