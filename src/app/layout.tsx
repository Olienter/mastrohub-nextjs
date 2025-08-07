import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { WorkspaceProvider } from '@/contexts/WorkspaceContext'
import BadgeNotificationProvider from '@/components/badges/BadgeNotificationProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MastroHub - AI Restaurant Management Platform | Professional Tools',
  description: 'AI-powered restaurant management tools. Increase profits by 15-30%, reduce food waste by 40%, save 10+ hours per week. Menu optimization, demand forecasting, and inventory management.',
  keywords: 'restaurant management, AI restaurant tools, menu optimization, demand forecasting, inventory management, professional restaurant software',
  authors: [{ name: 'MastroHub Team' }],
  creator: 'MastroHub',
  publisher: 'MastroHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mastrohub.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MastroHub - Transform Your Restaurant with AI',
    description: 'AI-powered restaurant management tools that actually work. Increase profits, reduce waste, save time.',
    url: 'https://mastrohub.com',
    siteName: 'MastroHub',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MastroHub - AI Restaurant Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MastroHub - AI Restaurant Management Platform',
    description: 'AI-powered restaurant management tools. Increase profits by 15-30%, reduce food waste by 40%.',
    images: ['/og-image.jpg'],
    creator: '@mastrohub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
  classification: 'Restaurant Management Software',
  other: {
    'theme-color': '#0a192f',
    'msapplication-TileColor': '#0a192f',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'MastroHub',
    'application-name': 'MastroHub',
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "MastroHub",
              "description": "AI-powered restaurant management platform",
              "url": "https://mastrohub.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free forever with no limitations"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              },
              "author": {
                "@type": "Organization",
                "name": "MastroHub",
                "url": "https://mastrohub.com"
              }
            })
          }}
        />
        
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MastroHub",
              "url": "https://mastrohub.com",
              "logo": "https://mastrohub.com/logo.png",
              "description": "AI-powered restaurant management platform",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bratislava",
                "addressCountry": "SK"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+421-555-123-456",
                "contactType": "customer service",
                "email": "hello@mastrohub.com"
              },
              "sameAs": [
                "https://twitter.com/mastrohub",
                "https://linkedin.com/company/mastrohub",
                "https://github.com/mastrohub"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <WorkspaceProvider>
            <AuthProvider>
              <BadgeNotificationProvider>
                <Navigation />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
              </BadgeNotificationProvider>
            </AuthProvider>
          </WorkspaceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}