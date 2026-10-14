import type { ImageDataLike } from "@/lib/codecs/image-data";

export function encodeBmp(image: ImageDataLike): Uint8Array {
  const { width, height, data } = image;
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelSize = rowSize * height;
  const fileSize = 54 + pixelSize;
  const out = new Uint8Array(fileSize);
  const view = new DataView(out.buffer);
  out[0] = 0x42;
  out[1] = 0x4d;
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(34, pixelSize, true);
  view.setUint32(38, 2835, true);
  view.setUint32(42, 2835, true);
  let offset = 54;
  for (let y = height - 1; y >= 0; y -= 1) {
    let cursor = offset;
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      out[cursor] = data[index + 2] ?? 0;
      out[cursor + 1] = data[index + 1] ?? 0;
      out[cursor + 2] = data[index] ?? 0;
      cursor += 3;
    }
    offset += rowSize;
  }
  return out;
}
