const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./next-intl.config.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      // Stub optional native/CLI deps pulled by wallet libs
      resolveAlias: {
        '@react-native-async-storage/async-storage': false,
        'pino-pretty': false
      }
    }
  },
  // Proxy /api/bases to external API domain
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/bases/:path*',
          destination: 'https://api.glomia.life/api/bases/:path*'
        }
      ]
    }
  },
  // Allow cross-origin dev access if needed (optional; adjust as necessary)
  // allowedDevOrigins: ["http://localhost:3000"],
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false
    }
    return config
  }
}

module.exports = withNextIntl(nextConfig)
