import { describe, expect, it } from "vitest";
import { readExifOrientation, readImageSize, readJpegMetadata, transplantJpegExif } from "@/lib/codecs/dimensions";

function jpegWithOrientation(width: number, height: number, orientation: number): Uint8Array {
  const exif = new Uint8Array([
    0x45, 0x78, 0x69, 0x66, 0x00, 0x00, 0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x12, 0x01, 0x03,
    0x00, 0x01, 0x00, 0x00, 0x00, orientation, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]);
  const app1Length = exif.length + 2;
  const sof = new Uint8Array([
    0xff,
    0xc0,
    0x00,
    0x0b,
    0x08,
    height >> 8,
    height & 0xff,
    width >> 8,
    width & 0xff,
    0x01,
    0x01,
    0x11,
    0x00,
  ]);
  return new Uint8Array([0xff, 0xd8, 0xff, 0xe1, app1Length >> 8, app1Length & 0xff, ...exif, ...sof, 0xff, 0xd9]);
}

describe("jpeg metadata", () => {
  it("swaps dimensions for sideways orientations", () => {
    expect(readImageSize(jpegWithOrientation(120, 40, 6), "jpg")).toEqual({
      width: 40,
      height: 120,
      orientation: 6,
    });
  });

  it("copies EXIF onto a new JPEG and resets orientation", () => {
    const transplanted = transplantJpegExif(jpegWithOrientation(10, 20, 6), new Uint8Array([0xff, 0xd8, 0xff, 0xd9]));
    expect(Array.from(transplanted.subarray(0, 4))).toEqual([0xff, 0xd8, 0xff, 0xe1]);
    const exif = readJpegMetadata(transplanted).exif;
    expect(exif).not.toBeNull();
    expect(readExifOrientation(exif!)).toBe(1);
  });
});
