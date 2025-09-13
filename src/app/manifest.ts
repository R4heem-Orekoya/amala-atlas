import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Amala Atlas",
    short_name: "AmalaAtlas",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff4d4f",
    icons: [
      {
        src: "/icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
