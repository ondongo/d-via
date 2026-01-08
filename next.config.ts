import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  //use images.remotePatterns
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "ko-zua.vercel.app",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "cdnwp.dealerk.com",
      },
      {
        protocol: "https",
        hostname: "i.gaw.to",
      },
      {
        protocol: "https",
        hostname: "googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
