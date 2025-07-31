import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SAMPLE_ARTICLES } from '@/data/articles';

export async function GET(request: NextRequest) {
  try {
    // Skús získať dáta z Supabase
    const { data: supabaseArticles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    // Ak Supabase zlyhá alebo nemá dáta, použij mock dáta
    if (error || !supabaseArticles || supabaseArticles.length === 0) {
      console.log('Using mock data as fallback');
      return NextResponse.json({
        articles: SAMPLE_ARTICLES,
        total: SAMPLE_ARTICLES.length,
        source: 'mock'
      });
    }

    // Transformuj Supabase dáta do požadovaného formátu
    const transformedArticles = supabaseArticles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      category: article.category,
      readTime: article.read_time,
      author: article.author,
      authorTitle: article.author_title,
      authorAvatar: article.author_avatar,
      publishedAt: article.published_at,
      slug: article.slug,
      featured: article.featured,
      tags: article.tags || [],
      viewCount: article.view_count,
      likeCount: article.like_count,
      factChecked: article.fact_checked,
      lastUpdated: article.last_updated
    }));

    return NextResponse.json({
      articles: transformedArticles,
      total: transformedArticles.length,
      source: 'supabase'
    });

  } catch (error) {
    console.error('API Error:', error);
    // Fallback na mock dáta
    return NextResponse.json({
      articles: SAMPLE_ARTICLES,
      total: SAMPLE_ARTICLES.length,
      source: 'mock-fallback'
    });
  }
} 