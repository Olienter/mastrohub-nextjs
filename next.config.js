/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable ESLint for better code quality
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint during builds
  },
  
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
  // Optimize package imports
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Optimize images for faster loading
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Optimize headers for faster response
  async headers() {
    return [
      {
        source: '/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Development optimizations
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Faster development builds
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 500,
      }
      
      // Keep optimization enabled for better debugging
      config.optimization = {
        ...config.optimization,
        minimize: false,
      }
      
      // Better source maps for debugging
      config.devtool = 'eval-source-map'
    }
    return config
  },
}

module.exports = nextConfig 