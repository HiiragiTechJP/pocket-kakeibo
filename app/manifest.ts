import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ポケット家計簿",
    short_name: "ポケット家計簿",
    description: "スマホでかんたんに使えるポケット家計簿アプリ",
    start_url: "/app",
    display: "standalone",
    background_color: "#e0f2fe",
    theme_color: "#0f766e",
    lang: "ja",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon.png",
        sizes: "577x577",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
