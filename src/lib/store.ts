"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SAMPLE_ARTICLES } from '@/data/articles';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  author: string;
  authorTitle?: string;
  authorAvatar?: string;
  publishedAt: string;
  slug: string;
  featured: boolean;
  tags: string[];
  viewCount: number;
  likeCount: number;
  factChecked: boolean;
  lastUpdated: string;
  status: 'draft' | 'published' | 'pending';
}

interface BlogStore {
  articles: Article[];
  selectedCategory: string;
  searchQuery: string;
  
  // Actions
  addArticle: (article: Omit<Article, 'id' | 'publishedAt' | 'lastUpdated' | 'viewCount' | 'likeCount'>) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  
  // Getters
  getPublishedArticles: () => Article[];
  getFeaturedArticles: () => Article[];
  getArticlesByCategory: (category: string) => Article[];
  getFilteredArticles: () => Article[];
}

// Transform sample articles to match our interface
const transformSampleArticles = (): Article[] => {
  return SAMPLE_ARTICLES.map(article => ({
    ...article,
    status: 'published' as const,
    factChecked: article.factChecked || false,
    lastUpdated: article.lastUpdated || article.publishedAt
  }));
};

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      articles: transformSampleArticles(),
      selectedCategory: 'all',
      searchQuery: '',
      
      addArticle: (articleData) => {
        const newArticle: Article = {
          ...articleData,
          id: Date.now().toString(),
          publishedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          viewCount: 0,
          likeCount: 0,
        };
        
        set((state) => ({
          articles: [newArticle, ...state.articles]
        }));
      },
      
      updateArticle: (id, updates) => {
        set((state) => ({
          articles: state.articles.map(article =>
            article.id === id
              ? { ...article, ...updates, lastUpdated: new Date().toISOString() }
              : article
          )
        }));
      },
      
      deleteArticle: (id) => {
        set((state) => ({
          articles: state.articles.filter(article => article.id !== id)
        }));
      },
      
      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
      },
      
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },
      
      getPublishedArticles: () => {
        return get().articles.filter(article => article.status === 'published');
      },
      
      getFeaturedArticles: () => {
        return get().articles.filter(article => article.featured && article.status === 'published');
      },
      
      getArticlesByCategory: (category) => {
        const articles = get().getPublishedArticles();
        if (category === 'all') return articles;
        return articles.filter(article => article.category === category);
      },
      
      getFilteredArticles: () => {
        const { selectedCategory, searchQuery } = get();
        let articles = get().getArticlesByCategory(selectedCategory);
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          articles = articles.filter(article =>
            article.title.toLowerCase().includes(query) ||
            article.excerpt.toLowerCase().includes(query) ||
            article.content.toLowerCase().includes(query) ||
            article.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        return articles;
      },
    }),
    {
      name: 'blog-store',
      partialize: (state) => ({ articles: state.articles }),
    }
  )
); 