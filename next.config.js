/** @type {import('next').NextConfig} */
const nextConfig = {
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
      {
        protocol: 'https',
        hostname: 'admin.thecrackedgrain.com',
        pathname: '/assets/**',
      },
    ],
  },
  serverExternalPackages: ['drizzle-kit'],
}

module.exports = nextConfig
