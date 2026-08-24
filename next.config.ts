import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone is for self-hosted Docker; it adds build-time memory use on Vercel.
  serverExternalPackages: ["mongoose"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Mongoose + Next 15 typecheck can OOM on Vercel Hobby; run `npm run typecheck` locally/CI.
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
  experimental: {
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
