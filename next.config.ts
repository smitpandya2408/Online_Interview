import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["127.0.0.1:3000", "localhost:3000", "127.0.0.1:52773"],
  serverExternalPackages: [],
};

export default nextConfig;
