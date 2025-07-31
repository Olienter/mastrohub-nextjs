import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurant Blog - MastroHub',
  description: 'Expert insights on restaurant management, menu engineering, and hospitality trends.',
  keywords: ['restaurant management', 'menu engineering', 'hospitality', 'food service', 'restaurant technology'],
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
    canonical: '/blog',
  },
  openGraph: {
    title: 'Restaurant Blog - MastroHub',
    description: 'Expert insights on restaurant management, menu engineering, and hospitality trends.',
    url: 'https://mastrohub.com/blog',
    siteName: 'MastroHub Blog',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Restaurant Blog - MastroHub',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Restaurant Blog - MastroHub',
    description: 'Expert insights on restaurant management, menu engineering, and hospitality trends.',
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
    'apple-mobile-web-app-title': 'MastroHub Blog',
    'application-name': 'MastroHub Blog',
    'mobile-web-app-capable': 'yes',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-layout">
      {children}
    </div>
  );
} 