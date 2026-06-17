/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    formats: ["image/webp", "image/avif"],
  },
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
