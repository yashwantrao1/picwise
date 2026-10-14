export interface ImageDataLike {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export function toImageData(data: Uint8Array | Uint8ClampedArray, width: number, height: number): ImageData {
  const pixels = new Uint8ClampedArray(data.length);
  pixels.set(data);
  return new ImageData(pixels, width, height);
}

export function cloneImageData(image: ImageData): ImageData {
  const pixels = new Uint8ClampedArray(image.data.length);
  pixels.set(image.data);
  return new ImageData(pixels, image.width, image.height);
}

export function hasTransparency(image: ImageDataLike): boolean {
  const { data } = image;
  for (let index = 3; index < data.length; index += 4) {
    if ((data[index] ?? 255) < 255) return true;
  }
  return false;
}

export function asBytes(data: ArrayBuffer | Uint8Array): Uint8Array {
  if (data instanceof Uint8Array) return new Uint8Array(data);
  return new Uint8Array(data);
}
