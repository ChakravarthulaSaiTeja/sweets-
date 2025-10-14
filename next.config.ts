import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'www.shutterstock.com', 'shutterstock.com', 'images.unsplash.com', 'sitarafoods.com', 't3.ftcdn.net', 'upload.wikimedia.org', 'chefsmandala.com', 'media.istockphoto.com', 'www.masala.tv', 'www.palatesdesire.com', 'savithrammas.com', 'c.ndtvimg.com', 'cdn-tps.b-cdn.net', 'tawablindia.com'],
    formats: ['image/webp', 'image/avif'],
  },
  serverExternalPackages: ['@prisma/client'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
