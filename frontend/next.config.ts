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
    ],
    domains: ['yxbboqcacbihxherpisb.supabase.co'], // allow images from Supabase
  },
};

export default nextConfig;
