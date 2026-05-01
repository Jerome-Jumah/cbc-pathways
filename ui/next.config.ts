import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // You can add more domains here later if you host images on AWS S3, Cloudinary, etc.
    ],
  },
};

export default nextConfig;
