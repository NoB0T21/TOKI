import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
     remotePatterns: [
      {
        protocol: "https",
        hostname: "yxbboqcacbihxherpisb.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ], // allow images from Supabase
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TS errors during build
  },
};

export default nextConfig;
