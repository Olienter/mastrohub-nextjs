import { SAMPLE_ARTICLES } from '@/data/articles';

export function generateSitemap() {
  const baseUrl = 'https://mastrohub.com';
  const currentDate = new Date().toISOString();

  const pages = [
    {
      url: '/',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/blog',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      url: '/menu-maker',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/analytics',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/forecast-planner',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    }
  ];

  // Add article pages
  const articlePages = SAMPLE_ARTICLES.map(article => ({
    url: `/blog/${article.slug}`,
    lastmod: article.lastUpdated || article.publishedAt,
    changefreq: 'monthly',
    priority: article.featured ? '0.8' : '0.6'
  }));

  const allPages = [...pages, ...articlePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

export function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://mastrohub.com/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

# Allow important pages
Allow: /blog/
Allow: /menu-maker/
Allow: /analytics/
Allow: /forecast-planner/`;
} 