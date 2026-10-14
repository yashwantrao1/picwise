import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/brand-mark";

export const alt = "Picwise";
export const size = { width: 1200, height: 1200 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<BrandMark size={size.width} />, { ...size });
}
