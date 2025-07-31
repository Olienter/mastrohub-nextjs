"use client";

import React from 'react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedAt: string;
  modifiedAt?: string;
  category: string;
  tags: string[];
}

interface StructuredDataProps {
  article?: Article;
  type: 'article' | 'breadcrumb' | 'organization' | 'website';
}

export default function StructuredData({ article, type }: StructuredDataProps) {
  const generateStructuredData = () => {
    switch (type) {
      case 'article':
        if (!article) return null;
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.excerpt,
          "image": article.image,
          "author": {
            "@type": "Person",
            "name": article.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "MastroHub",
            "logo": {
              "@type": "ImageObject",
              "url": "https://mastrohub.com/logo.png"
            }
          },
          "datePublished": article.publishedAt,
          "dateModified": article.modifiedAt || article.publishedAt,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://mastrohub.com/blog/${article.id}`
          },
          "articleSection": article.category,
          "keywords": article.tags.join(', '),
          "inLanguage": "en-US"
        };

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://mastrohub.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": "https://mastrohub.com/blog"
            }
          ]
        };

      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "MastroHub",
          "url": "https://mastrohub.com",
          "logo": "https://mastrohub.com/logo.png",
          "description": "Expert restaurant management software and consulting services",
          "foundingDate": "2020",
          "sameAs": [
            "https://linkedin.com/company/mastrohub",
            "https://twitter.com/mastrohub",
            "https://facebook.com/mastrohub"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-0123",
            "contactType": "customer service",
            "email": "hello@mastrohub.com"
          }
        };

      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "MastroHub Blog",
          "url": "https://mastrohub.com",
          "description": "Expert insights on restaurant management, menu engineering, and hospitality trends",
          "publisher": {
            "@type": "Organization",
            "name": "MastroHub"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://mastrohub.com/blog/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };

      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
} 