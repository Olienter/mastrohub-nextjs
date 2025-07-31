import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface BlogPost {
  slug: string;
  updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mastrohub.com';
  
  // Get all blog posts
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  let posts: BlogPost[] = [];
  
  try {
    const filenames = fs.readdirSync(postsDirectory);
    posts = filenames
      .filter(filename => filename.endsWith('.mdx'))
      .map(filename => {
        const filePath = path.join(postsDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        
        return {
          slug: data.slug,
          updatedAt: data.updatedAt,
        };
      });
  } catch {
    console.log('No blog posts found');
  }

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // Blog post pages
  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/posts/${post.slug}`,
    lastModified: new Date(post.updatedAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPosts];
} 