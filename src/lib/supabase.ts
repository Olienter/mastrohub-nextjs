import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-for-development';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          image: string;
          category: string;
          read_time: string;
          author: string;
          author_title?: string;
          author_avatar?: string;
          published_at: string;
          status: 'draft' | 'published' | 'pending';
          featured: boolean;
          tags: string[];
          view_count: number;
          like_count: number;
          fact_checked: boolean;
          last_updated: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          image: string;
          category: string;
          read_time: string;
          author: string;
          author_title?: string;
          author_avatar?: string;
          published_at: string;
          status?: 'draft' | 'published' | 'pending';
          featured?: boolean;
          tags?: string[];
          view_count?: number;
          like_count?: number;
          fact_checked?: boolean;
          last_updated?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          image?: string;
          category?: string;
          read_time?: string;
          author?: string;
          author_title?: string;
          author_avatar?: string;
          published_at?: string;
          status?: 'draft' | 'published' | 'pending';
          featured?: boolean;
          tags?: string[];
          view_count?: number;
          like_count?: number;
          fact_checked?: boolean;
          last_updated?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          username?: string;
          full_name?: string;
          avatar_url?: string;
          bio?: string;
          role: 'reader' | 'contributor' | 'moderator' | 'admin';
          subscription_status: 'free' | 'premium';
          subscription_expires?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string;
          full_name?: string;
          avatar_url?: string;
          bio?: string;
          role?: 'reader' | 'contributor' | 'moderator' | 'admin';
          subscription_status?: 'free' | 'premium';
          subscription_expires?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string;
          bio?: string;
          role?: 'reader' | 'contributor' | 'moderator' | 'admin';
          subscription_status?: 'free' | 'premium';
          subscription_expires?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 