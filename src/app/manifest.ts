import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Campus Table",
    description: "학식 매번 줄서서 주문하세요? 이제는 쉽고 빠른 학식 주문 서비스 '캠퍼스 테이블'을 사용하세요!!",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f55b03",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}