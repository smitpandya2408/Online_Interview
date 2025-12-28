import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["127.0.0.1:3000", "localhost:3000", "127.0.0.1:52773"],
  serverExternalPackages: [],
  experimental: {
    optimizePackageImports: ["@/"],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
  },
};

export default nextConfig;
