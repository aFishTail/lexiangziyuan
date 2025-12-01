import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 禁用 standalone 输出模式（Windows 上有权限问题）
  // output: 'standalone',

  // 禁用 TypeScript 和 ESLint 检查以加快构建
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'api',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'www.lxziyuan.com',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
