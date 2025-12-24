const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|webp|svg|gif|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 2592000 // 30 days
        }
      }
    },
    {
      urlPattern: /\/brewing.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'brewing-tools-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 604800 // 7 days
        }
      }
    },
    {
      urlPattern: /\/recipes.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'recipes-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 604800 // 7 days
        }
      }
    },
    {
      urlPattern: /.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'default-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 86400 // 1 day
        },
        networkTimeoutSeconds: 10
      }
    }
  ],
  fallbacks: {
    document: '/offline'
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.thecrackedgrain.com',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = withPWA(nextConfig)
