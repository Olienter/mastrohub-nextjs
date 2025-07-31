import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import BadgeNotificationProvider from '@/components/badges/BadgeNotificationProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MastroHub - Restaurant Management Software',
  description: 'Expert restaurant management software and consulting services. Transform your restaurant with data-driven strategies.',
  keywords: ['restaurant management', 'menu engineering', 'hospitality software', 'restaurant technology'],
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
    title: 'MastroHub - Restaurant Management Software',
    description: 'Expert restaurant management software and consulting services.',
    url: 'https://mastrohub.com',
    siteName: 'MastroHub',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'MastroHub - Restaurant Management Software',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MastroHub - Restaurant Management Software',
    description: 'Expert restaurant management software and consulting services.',
    images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80'],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <BadgeNotificationProvider>
              {children}
            </BadgeNotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}