import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { LaunchManager } from '@/lib/launch'
import { PerformanceManager } from '@/lib/performance'
import { SecurityManager } from '@/lib/security'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MastroHub - Restaurant Management Platform',
  description: 'Comprehensive restaurant management platform with AI assistant',
  keywords: 'restaurant, management, AI, menu, analytics',
  authors: [{ name: 'MastroHub Team' }],
  creator: 'MastroHub',
  publisher: 'MastroHub',
  robots: 'index, follow',
  openGraph: {
    title: 'MastroHub - Restaurant Management Platform',
    description: 'Comprehensive restaurant management platform with AI assistant',
    type: 'website',
    locale: 'en_US',
    siteName: 'MastroHub'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MastroHub - Restaurant Management Platform',
    description: 'Comprehensive restaurant management platform with AI assistant'
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
}

// Initialize launch manager and performance monitoring
if (typeof window !== 'undefined') {
  // Initialize performance monitoring
  const performance = PerformanceManager.getInstance();
  performance.init();
  performance.optimizeImages();
  performance.preloadCriticalResources();
  performance.optimizeFonts();
  performance.enableServiceWorkerCaching();

  // Initialize security manager
  const security = SecurityManager.getInstance();
  
  // Initialize launch manager
  const launchManager = LaunchManager.getInstance();
  launchManager.initialize().catch(console.error);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="launch-ready">
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/api/menu" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/api/categories" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/api/user" as="fetch" crossOrigin="anonymous" />
        
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link sr-only">
          Skip to main content
        </a>
      </head>
      <body className={`${inter.className} optimized-render`}>
        <Providers>
          <div id="main-content" className="critical">
            {children}
          </div>
        </Providers>
        
        {/* Performance monitoring script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if (typeof window !== 'undefined') {
                // Track Core Web Vitals
                import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                  getCLS(console.log);
                  getFID(console.log);
                  getFCP(console.log);
                  getLCP(console.log);
                  getTTFB(console.log);
                });
                
                // Track custom metrics
                const performance = window.performance;
                if (performance && performance.mark) {
                  performance.mark('app-loaded');
                }
              }
            `
          }}
        />
      </body>
    </html>
  )
}