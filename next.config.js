/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['drizzle-kit'],
  },
  webpack: (config, { isServer }) => {
    // Exclude drizzle-kit from webpack bundling
    config.externals.push('drizzle-kit');
    return config;
  },
};

module.exports = nextConfig;
