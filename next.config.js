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
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['drizzle-kit'],
  },
  serverExternalPackages: ['drizzle-kit'],
  webpack: (config, { isServer }) => {
    // Exclude drizzle-kit from webpack bundling on BOTH server and client
    config.externals.push('drizzle-kit');
    return config;
  },
};

module.exports = nextConfig;
