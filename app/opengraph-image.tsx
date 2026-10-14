import { ImageResponse } from "next/og";

export const alt = "Picwise, smart tools for your images";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#101828",
          color: "#f5f7ff",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 32, fontWeight: 700 }}>
          <span>Pic</span>
          <span style={{ color: "#2F4BFF" }}>wise</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>
            Convert and compress images without uploading them.
          </div>
          <div style={{ fontSize: 28, color: "#c5cce0" }}>PNG, JPG, WebP, AVIF, GIF, BMP, TIFF, SVG, ICO, and HEIC. In your browser.</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
