/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint during builds
  },
  
  // Remove experimental features that slow down compilation
  experimental: {
    // mdxRs: true, // Commented out for faster compilation
    optimizePackageImports: ['lucide-react'], // Remove framer-motion from optimization
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
    formats: ['image/webp'], // Remove avif for faster processing
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Reduced sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Reduced sizes
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
  reactStrictMode: false, // Disable for faster development
  
  // Development optimizations
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Faster development builds
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 500,
      }
      
      // Disable optimization in development for faster builds
      config.optimization = {
        ...config.optimization,
        minimize: false,
        splitChunks: false,
      }
      
      // Faster source maps
      config.devtool = 'eval-cheap-module-source-map'
    }
    return config
  },
}

module.exports = nextConfig 