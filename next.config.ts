import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/entry", destination: "/", permanent: false },
      { source: "/dashboard", destination: "/", permanent: false },
      { source: "/list", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
