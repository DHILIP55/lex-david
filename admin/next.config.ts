import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "bcrypt"],
  turbopack: {
    root: __dirname,
  },
  devIndicators: false,
};

export default nextConfig;
