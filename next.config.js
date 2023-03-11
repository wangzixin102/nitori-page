/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.nitori-net.jp',
      },
      {
        protocol: 'https',
        hostname: 'manetatsu.com',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'ryutsuu.com',
      },
      {
        protocol: 'https',
        hostname: 'p1-a50ece1c.imageflux.jp',
      }
    ],
  },
}

module.exports = nextConfig
