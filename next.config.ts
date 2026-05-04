import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/(login|register|onboarding)",
  //       headers: [{ key: "Cache-Control", value: "no-store" }],
  //     },
  //   ];
  // },
};

export default nextConfig;
