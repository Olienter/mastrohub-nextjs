"use client";

import React from 'react';
import Head from 'next/head';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'article' | 'website';
  author?: string;
  publishedAt?: string;
  modifiedAt?: string;
  category?: string;
  tags?: string[];
}

export default function MetaTags({
  title,
  description,
  keywords = [],
  image = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  url,
  type = 'website',
  author,
  publishedAt,
  modifiedAt,
  category,
  tags = []
}: MetaTagsProps) {
  const fullUrl = url ? `https://mastrohub.com${url}` : 'https://mastrohub.com';
  const fullImage = image.startsWith('http') ? image : `https://mastrohub.com${image}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author || 'MastroHub Team'} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="MastroHub Blog" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@mastrohub" />
      <meta name="twitter:creator" content="@mastrohub" />
      
      {/* Article Specific Meta Tags */}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {type === 'article' && modifiedAt && (
        <meta property="article:modified_time" content={modifiedAt} />
      )}
      {type === 'article' && category && (
        <meta property="article:section" content={category} />
      )}
      {type === 'article' && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#0a192f" />
      <meta name="msapplication-TileColor" content="#0a192f" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="MastroHub Blog" />
      <meta name="application-name" content="MastroHub Blog" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
}