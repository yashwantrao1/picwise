import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Picwise",
    short_name: "Picwise",
    description: "Smart tools for your images.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f5f7ff",
    theme_color: "#2f4bff",
    icons: [
      { src: "/icon", sizes: "48x48", type: "image/png" },
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
