import type { NextConfig } from "next";
import { isProduction } from "@/shared/config/env.client";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      // 모든 *.svg 파일을 @svgr/webpack으로 처리해서 JS(React 컴포넌트)로 변환
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        and: [/\.(js|ts)x?$/],
      },
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            // 필요하면 여기서 svgr 옵션 지정 가능
            // 예: icon: true, svgo: true 등
          },
        },
      ],
    });

    return config;
  },

  // next/image 원격 호스트 허용 설정
  images: {
    // NAT64/DNS64 등으로 “사설 IP로 판정”되는 경우를 개발환경에서만 허용
    dangerouslyAllowLocalIP: !isProduction(),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "campustable-s3.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**", // menu 경로만 허용. 더 넓게 허용하려면 "/**"
      },
    ],
  },

  reactCompiler: true,
};

export default nextConfig;
