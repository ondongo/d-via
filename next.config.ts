import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  
  // Optionally, add any other Next.js config below
  images: {
    domains: [
      "images.unsplash.com",
      "example.com",
      "localhost:3000",
      "firebasestorage.googleapis.com",
      "ko-zua.vercel.app",
      "upload.wikimedia.org",
      "cdnwp.dealerk.com",
      "i.gaw.to",
      "googleusercontent.com",
      "lh3.googleusercontent.com",
      "static.wixstatic.com"
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
