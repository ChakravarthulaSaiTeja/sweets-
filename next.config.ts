import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable Next.js image optimization (requires removing output: 'export')
    // Image optimization automatically converts images to WebP/AVIF and resizes them
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
      },
      {
        protocol: 'https',
        hostname: 'shutterstock.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'sitarafoods.com',
      },
      {
        protocol: 'https',
        hostname: 't3.ftcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'chefsmandala.com',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
      },
      {
        protocol: 'https',
        hostname: 'www.masala.tv',
      },
      {
        protocol: 'https',
        hostname: 'www.palatesdesire.com',
      },
      {
        protocol: 'https',
        hostname: 'savithrammas.com',
      },
      {
        protocol: 'https',
        hostname: 'c.ndtvimg.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-tps.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: 'tawablindia.com',
      },
      {
        protocol: 'https',
        hostname: 'www.indianhealthyrecipes.com',
      },
    ],
    // Automatically serve images in modern formats (WebP, AVIF) when supported
    formats: ['image/webp', 'image/avif'],
    // Image optimization settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum cache TTL for optimized images (in seconds)
    minimumCacheTTL: 60,
  },
  // Removed output: 'export' to enable Next.js image optimization
  // This allows the project to use Static Site Generation (SSG) which:
  // - Still generates static HTML at build time (works with generateStaticParams)
  // - Enables Next.js Image optimization
  // - Works perfectly on Vercel, Netlify, and other platforms
  // 
  // For Docker/standalone deployments, uncomment the line below:
  // output: 'standalone',
  // 
  // For Vercel/Netlify deployments, no output setting is needed (default SSG works)
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
