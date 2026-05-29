import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint blocking deployment builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
