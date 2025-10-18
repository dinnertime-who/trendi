import type { NextConfig } from "next";
import { publicEnv } from "@/lib/env";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: publicEnv.NEXT_PUBLIC_IMAGE_DOMAIN,
      },
    ],
  },

  // typedRoute 활성화
  typedRoutes: true,

  // poweredByHeader 비활성화
  poweredByHeader: false,

  // reactStrictMode 활성화
  reactStrictMode: true,

  // 소스맵 비활성화
  productionBrowserSourceMaps: false,

  // 보안 헤더 설정
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  experimental: {
    // react compiler 활성화
    reactCompiler: true,

    // 서버 소스 맵 비활성화
    serverSourceMaps: false,
  },
};

export default nextConfig;
