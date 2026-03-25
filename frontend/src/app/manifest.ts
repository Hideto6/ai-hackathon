import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "じじいにゅーす",
    short_name: "じじいにゅーす",
    description: "ニュースタイトルをスマホへ通知するアプリ",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/image/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/image/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
