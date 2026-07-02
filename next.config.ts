import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      {
        source: "/api/chat",
        destination: "https://portfolio-chatbot-3jqz.onrender.com/api/ask",
      },
    ];
  },
  // Allow JSON imports for content files
  experimental: {},
};

export default nextConfig;
